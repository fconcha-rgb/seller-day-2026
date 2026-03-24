import { supabase } from './supabase'

// ═══ CARGAR DATOS ═══

export async function loadPartners() {
 const { data, error } = await supabase
   .from('partners').select('*').order('stand_number')
 if (error) throw error
 return data
}

export async function loadTeam() {
 const { data, error } = await supabase
   .from('team_members').select('*').eq('is_active', true).order('name')
 if (error) throw error
 return data
}

export async function loadSlots() {
 const { data, error } = await supabase
   .from('time_slots').select('*').order('start_time')
 if (error) throw error
 return data
}

export async function loadAvailability() {
 const { data, error } = await supabase
   .from('host_availability').select('*').eq('is_available', true)
 if (error) throw error
 return data
}

export async function loadMeetings() {
 const { data, error } = await supabase
   .from('meetings').select('*').order('slot_time')
 if (error) throw error
 return data
}

export async function loadNotifications() {
 const { data, error } = await supabase
   .from('notifications').select('*').order('created_at', { ascending: false })
 if (error) throw error
 return data
}

// ═══ CREAR SOLICITUD ═══

export async function createMeeting(meetingData) {
 const { data, error } = await supabase
   .from('meetings')
   .insert([{
     host_id: meetingData.host_id,
     host_type: meetingData.host_type,
     host_name: meetingData.host_name,
     slot_id: meetingData.slot_id,
     slot_time: meetingData.slot_time,
     seller_name: meetingData.seller_name,
     seller_email: meetingData.seller_email,
     seller_company: meetingData.seller_company,
     notes: meetingData.notes || null,
     status: 'pending'
   }])
   .select()
   .single()
 if (error) throw error
 return data
}

// ═══ CREAR NOTIFICACIÓN ═══

export async function createNotification(n) {
 const { data, error } = await supabase
   .from('notifications')
   .insert([{
     type: n.type,
     title: n.title,
     message: n.message,
     recipient_type: n.recipient_type,
     recipient_id: n.recipient_id,
     meeting_id: n.meeting_id || null,
     read: false
   }])
   .select()
   .single()
 if (error) throw error
 return data
}

// ═══ ACEPTAR REUNIÓN ═══

export async function acceptMeeting(meetingId) {
 // Obtener la reunión
 const { data: meeting, error: e1 } = await supabase
   .from('meetings').select('*').eq('id', meetingId).single()
 if (e1) throw e1

 // Aceptar
 const { error: e2 } = await supabase
   .from('meetings').update({ status: 'accepted' }).eq('id', meetingId)
 if (e2) throw e2

 // Auto-rechazar otras pendientes del mismo slot
 const { data: conflicting } = await supabase
   .from('meetings').select('*')
   .eq('host_id', meeting.host_id)
   .eq('host_type', meeting.host_type)
   .eq('slot_id', meeting.slot_id)
   .eq('status', 'pending')
   .neq('id', meetingId)

 if (conflicting && conflicting.length > 0) {
   await supabase
     .from('meetings')
     .update({ status: 'rejected' })
     .in('id', conflicting.map(m => m.id))

   for (const m of conflicting) {
     await createNotification({
       type: 'meeting_rejected',
       title: 'Solicitud no confirmada',
       message: 'Tu solicitud con ' + m.host_name + ' a las ' + m.slot_time + ' no pudo ser confirmada.',
       recipient_type: 'seller',
       recipient_id: m.seller_email,
       meeting_id: m.id
     })
   }
 }

 return meeting
}

// ═══ RECHAZAR REUNIÓN ═══

export async function rejectMeeting(meetingId) {
 const { data: meeting, error: e1 } = await supabase
   .from('meetings').select('*').eq('id', meetingId).single()
 if (e1) throw e1

 const { error: e2 } = await supabase
   .from('meetings').update({ status: 'rejected' }).eq('id', meetingId)
 if (e2) throw e2

 return meeting
}

// ═══ MARCAR NOTIFICACIONES LEÍDAS ═══

export async function markNotifsRead(recipientType, recipientId) {
 await supabase
   .from('notifications')
   .update({ read: true })
   .eq('recipient_type', recipientType)
   .eq('recipient_id', recipientId)
   .eq('read', false)
}

export async function markOneNotifRead(notifId) {
 await supabase
   .from('notifications')
   .update({ read: true })
   .eq('id', notifId)
}

// ═══ LOGIN EQUIPO ═══

export async function verifyTeamLogin(email) {
 const { data, error } = await supabase
   .from('team_members')
   .select('*')
   .eq('email', email.toLowerCase().trim())
   .eq('is_active', true)
   .single()
 if (error) return null
 return data
}

// ═══ REALTIME ═══

export function subscribeMeetings(onInsert, onUpdate) {
 return supabase
   .channel('meetings-rt')
   .on('postgres_changes',
     { event: 'INSERT', schema: 'public', table: 'meetings' },
     (p) => onInsert(p.new))
   .on('postgres_changes',
     { event: 'UPDATE', schema: 'public', table: 'meetings' },
     (p) => onUpdate(p.new))
   .subscribe()
}

export function subscribeNotifications(onInsert) {
 return supabase
   .channel('notifs-rt')
   .on('postgres_changes',
     { event: 'INSERT', schema: 'public', table: 'notifications' },
     (p) => onInsert(p.new))
   .subscribe()
}

export function unsubscribe(channel) {
 supabase.removeChannel(channel)
}