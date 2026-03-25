import { useState, useEffect, useCallback, useRef } from "react";
import {
Bell, Search, X, Check, Clock, Users, Building2, CalendarDays,
TrendingUp, Download, ArrowLeft, LogOut, CheckCheck, AlertCircle,
Send, XCircle, Info, Printer, ClipboardList
} from "lucide-react";
import {
BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";

/* ═══════════════════════════════════════════════════════════════
SELLER DAY 2026 — FALABELLA MARKETPLACE
Versión completa con notificaciones in-app, sin emails
═══════════════════════════════════════════════════════════════ */

// ═══════════════ DEMO DATA ═══════════════

const PARTNERS = [
{ id: "p1", name: "Samsung", category: "Tecnología", contact_name: "María González", description: "Líder mundial en tecnología de consumo, semiconductores y pantallas de última generación.", stand_number: 1, color_hex: "#1428A0", logo_emoji: "📱" },
{ id: "p2", name: "Adidas", category: "Moda & Deporte", contact_name: "Carlos Ruiz", description: "Marca global de ropa deportiva, calzado y accesorios de alto rendimiento.", stand_number: 2, color_hex: "#000000", logo_emoji: "👟" },
{ id: "p3", name: "L’Oréal", category: "Belleza", contact_name: "Valentina López", description: "Grupo líder mundial en cosmética, cuidado de la piel y fragancias premium.", stand_number: 3, color_hex: "#8B6914", logo_emoji: "💄" },
{ id: "p4", name: "Sony", category: "Electrónica", contact_name: "Tomás Herrera", description: "Innovación en entretenimiento, gaming, audio profesional y tecnología de vanguardia.", stand_number: 4, color_hex: "#00439C", logo_emoji: "🎮" },
{ id: "p5", name: "Nike", category: "Moda & Deporte", contact_name: "Andrea Muñoz", description: "La marca deportiva más icónica del mundo. Innovación para cada atleta.", stand_number: 5, color_hex: "#F47521", logo_emoji: "🏃" },
];

const TEAM = [
{ id: "t1", name: "Roberto Sánchez", role: "Key Account Manager", area: "Sellers", email: "roberto.sanchez@falabella.com", emoji: "👨‍💼", is_active: true },
{ id: "t2", name: "Daniela Fuentes", role: "Category Manager", area: "Tecnología", email: "daniela.fuentes@falabella.com", emoji: "👩‍💻", is_active: true },
{ id: "t3", name: "Andrés Morales", role: "Logistics Partner", area: "Operaciones", email: "andres.morales@falabella.com", emoji: "📦", is_active: true },
{ id: "t4", name: "Camila Vega", role: "Marketing Manager", area: "Marketing", email: "camila.vega@falabella.com", emoji: "📣", is_active: true },
{ id: "t5", name: "Felipe Castro", role: "Seller Success", area: "Sellers", email: "felipe.castro@falabella.com", emoji: "🚀", is_active: true },
{ id: "t6", name: "Patricia Ríos", role: "Financial Services", area: "Finanzas", email: "patricia.rios@falabella.com", emoji: "💰", is_active: true },
];

const SLOTS = [
{ id: "s1", start_time: "09:00", end_time: "09:30", duration_minutes: 30 },
{ id: "s2", start_time: "09:30", end_time: "10:00", duration_minutes: 30 },
{ id: "s3", start_time: "10:00", end_time: "10:30", duration_minutes: 30 },
{ id: "s4", start_time: "10:30", end_time: "11:00", duration_minutes: 30 },
{ id: "s5", start_time: "11:00", end_time: "11:30", duration_minutes: 30 },
{ id: "s6", start_time: "11:30", end_time: "12:00", duration_minutes: 30 },
{ id: "s7", start_time: "13:00", end_time: "13:30", duration_minutes: 30 },
{ id: "s8", start_time: "13:30", end_time: "14:00", duration_minutes: 30 },
{ id: "s9", start_time: "14:00", end_time: "14:30", duration_minutes: 30 },
{ id: "s10", start_time: "14:30", end_time: "15:00", duration_minutes: 30 },
{ id: "s11", start_time: "15:00", end_time: "15:30", duration_minutes: 30 },
{ id: "s12", start_time: "15:30", end_time: "16:00", duration_minutes: 30 },
{ id: "s13", start_time: "16:00", end_time: "16:30", duration_minutes: 30 },
{ id: "s14", start_time: "16:30", end_time: "17:00", duration_minutes: 30 },
];

const buildAvailability = () => {
const a: any[] = [];
PARTNERS.forEach(p => SLOTS.forEach(s => {
if (Math.random() > 0.15) a.push({ host_id: p.id, host_type: "partner", slot_id: s.id });
}));
TEAM.forEach(t => SLOTS.forEach(s => {
if (Math.random() > 0.1) a.push({ host_id: t.id, host_type: "team", slot_id: s.id });
}));
return a;
};

const SEED_MEETINGS: any[] = [
{ id: "m1", host_id: "t1", host_type: "team", host_name: "Roberto Sánchez", slot_id: "s1", slot_time: "09:00", seller_name: "Juan Pérez", seller_email: "juan@tiendaonline.cl", seller_company: "TiendaOnline", status: "pending", notes: "Quiero hablar sobre expansión a nuevas categorías", created_at: Date.now() - 600000 },
{ id: "m2", host_id: "p1", host_type: "partner", host_name: "Samsung", slot_id: "s3", slot_time: "10:00", seller_name: "Ana López", seller_email: "ana@electroshop.cl", seller_company: "ElectroShop", status: "accepted", notes: "Interesada en programa de partners Samsung", created_at: Date.now() - 3600000 },
{ id: "m3", host_id: "t2", host_type: "team", host_name: "Daniela Fuentes", slot_id: "s2", slot_time: "09:30", seller_name: "Pedro Gómez", seller_email: "pedro@techstore.cl", seller_company: "TechStore Chile", status: "pending", notes: "Necesito asesoría sobre catálogo tecnología", created_at: Date.now() - 1200000 },
{ id: "m4", host_id: "t4", host_type: "team", host_name: "Camila Vega", slot_id: "s5", slot_time: "11:00", seller_name: "María Torres", seller_email: "maria@modachile.cl", seller_company: "ModaChile", status: "accepted", notes: "Campaña de marketing conjunta para Q4", created_at: Date.now() - 7200000 },
{ id: "m5", host_id: "p3", host_type: "partner", host_name: "L’Oréal", slot_id: "s7", slot_time: "13:00", seller_name: "Laura Díaz", seller_email: "laura@belleza.cl", seller_company: "BellezaPro", status: "rejected", notes: "", created_at: Date.now() - 5400000 },
{ id: "m6", host_id: "t5", host_type: "team", host_name: "Felipe Castro", slot_id: "s4", slot_time: "10:30", seller_name: "Diego Ramírez", seller_email: "diego@sportzone.cl", seller_company: "SportZone", status: "pending", notes: "Mejorar mi performance como seller", created_at: Date.now() - 900000 },
{ id: "m7", host_id: "p5", host_type: "partner", host_name: "Nike", slot_id: "s8", slot_time: "13:30", seller_name: "Carla Muñoz", seller_email: "carla@fitshop.cl", seller_company: "FitShop", status: "accepted", notes: "", created_at: Date.now() - 4800000 },
{ id: "m8", host_id: "t3", host_type: "team", host_name: "Andrés Morales", slot_id: "s9", slot_time: "14:00", seller_name: "Tomás Silva", seller_email: "tomas@rapidenvios.cl", seller_company: "RápidEnvíos", status: "pending", notes: "Consulta sobre tiempos de despacho y logística inversa", created_at: Date.now() - 300000 },
{ id: "m9", host_id: "p2", host_type: "partner", host_name: "Adidas", slot_id: "s11", slot_time: "15:00", seller_name: "Sofía Herrera", seller_email: "sofia@urbanwear.cl", seller_company: "UrbanWear", status: "pending", notes: "Quiero ser distribuidor autorizado", created_at: Date.now() - 180000 },
{ id: "m10", host_id: "t6", host_type: "team", host_name: "Patricia Ríos", slot_id: "s6", slot_time: "11:30", seller_name: "Rodrigo Vega", seller_email: "rodrigo@megastore.cl", seller_company: "MegaStore", status: "accepted", notes: "Opciones de financiamiento para sellers", created_at: Date.now() - 6000000 },
];

const SEED_NOTIFS: any[] = [
{ id: "n1", type: "request_sent", title: "Solicitud enviada", message: "Tu solicitud de reunión con Roberto Sánchez a las 09:00 fue enviada.", timestamp: Date.now() - 600000, read: false, recipient_type: "seller", recipient_id: "juan@tiendaonline.cl", meeting_id: "m1" },
{ id: "n2", type: "new_request", title: "Nueva solicitud", message: "Juan Pérez de TiendaOnline quiere reunirse contigo a las 09:00.", timestamp: Date.now() - 600000, read: false, recipient_type: "team", recipient_id: "t1", meeting_id: "m1" },
{ id: "n3", type: "meeting_confirmed", title: "¡Reunión confirmada!", message: "Samsung te espera a las 10:00 en Stand #1.", timestamp: Date.now() - 3000000, read: true, recipient_type: "seller", recipient_id: "ana@electroshop.cl", meeting_id: "m2" },
{ id: "n4", type: "new_request", title: "Nueva solicitud", message: "Pedro Gómez de TechStore Chile quiere reunirse contigo a las 09:30.", timestamp: Date.now() - 1200000, read: false, recipient_type: "team", recipient_id: "t2", meeting_id: "m3" },
{ id: "n5", type: "meeting_confirmed", title: "¡Reunión confirmada!", message: "Camila Vega te espera a las 11:00 — Mesa de reuniones.", timestamp: Date.now() - 6500000, read: true, recipient_type: "seller", recipient_id: "maria@modachile.cl", meeting_id: "m4" },
{ id: "n6", type: "meeting_rejected", title: "Solicitud no confirmada", message: "Tu solicitud con L’Oréal a las 13:00 no pudo ser confirmada.", timestamp: Date.now() - 5000000, read: true, recipient_type: "seller", recipient_id: "laura@belleza.cl", meeting_id: "m5" },
{ id: "n7", type: "new_request", title: "Nueva solicitud", message: "Diego Ramírez de SportZone quiere reunirse contigo a las 10:30.", timestamp: Date.now() - 900000, read: false, recipient_type: "team", recipient_id: "t5", meeting_id: "m6" },
{ id: "n8", type: "meeting_created", title: "Nueva solicitud", message: "Diego Ramírez → Felipe Castro a las 10:30", timestamp: Date.now() - 900000, read: false, recipient_type: "admin", recipient_id: "admin", meeting_id: "m6" },
{ id: "n9", type: "meeting_status_changed", title: "Reunión aceptada", message: "Samsung aceptó reunión con Ana López a las 10:00", timestamp: Date.now() - 3000000, read: true, recipient_type: "admin", recipient_id: "admin", meeting_id: "m2" },
{ id: "n10", type: "new_request", title: "Nueva solicitud", message: "Tomás Silva de RápidEnvíos quiere reunirse contigo a las 14:00.", timestamp: Date.now() - 300000, read: false, recipient_type: "team", recipient_id: "t3", meeting_id: "m8" },
];

// ═══════════════ HELPERS ═══════════════

let _uid = 200;
const uid = () => `id_${++_uid}`;

const timeAgo = (ts: number) => {
const diff = Date.now() - ts;
const mins = Math.floor(diff / 60000);
if (mins < 1) return "ahora";
if (mins < 60) return `hace ${mins} min`;
const hrs = Math.floor(mins / 60);
if (hrs < 24) return `hace ${hrs}h`;
return `hace ${Math.floor(hrs / 24)}d`;
};

// ═══════════════ CSS ═══════════════

const CSS = `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'); :root{--gp:#006738;--gd:#004825;--gl:#edfaf3;--oa:#E85D00;--ol:#FFF3EB;--bp:#111;--wh:#FFF;--cr:#FAF8F5;--g1:#F5F5F5;--g2:#E8E8E8;--g4:#AAA;--g7:#444} *{margin:0;padding:0;box-sizing:border-box} body,#root{font-family:'Poppins',sans-serif;background:var(--cr);color:var(--g7);-webkit-font-smoothing:antialiased;overflow-x:hidden} @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}} @keyframes scaleIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}} @keyframes slideRight{from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:translateX(0)}} @keyframes slideOutRight{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(100%)}} @keyframes toastIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}} @keyframes toastOut{from{opacity:1}to{opacity:0;transform:translateX(40px)}} @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}} @keyframes heroPat{0%{background-position:0 0}100%{background-position:40px 40px}} .fi{animation:fadeIn .4s ease-out both}.su{animation:slideUp .45s ease-out both}.si{animation:scaleIn .3s ease-out both} .hero{background:linear-gradient(135deg,#006738 0%,#004825 100%);position:relative;overflow:hidden} .hero::before{content:'';position:absolute;inset:0;background-image:repeating-conic-gradient(#fff1 0% 25%,transparent 0% 50%);background-size:24px 24px;animation:heroPat 10s linear infinite;pointer-events:none} .hero::after{content:'';position:absolute;top:-40%;right:-15%;width:420px;height:420px;background:radial-gradient(circle,rgba(232,93,0,.12) 0%,transparent 70%);pointer-events:none} .hero-in{position:relative;z-index:2;padding:24px 20px 18px;max-width:1140px;margin:0 auto;width:100%} .hero-row{display:flex;align-items:center;gap:10px;justify-content:space-between} .hero-brand{display:flex;align-items:center;gap:10px} .hero-logo{width:38px;height:38px;background:var(--oa);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:#fff;box-shadow:0 4px 12px rgba(232,93,0,.3)} .hero-title{font-weight:700;font-size:22px;color:#fff;letter-spacing:-.4px;line-height:1.1} .hero-title span{color:var(--oa)} .hero-sub{font-weight:300;font-size:13px;color:rgba(255,255,255,.7);margin-top:4px} .hero-actions{display:flex;align-items:center;gap:8px} .bell-wrap{position:relative;cursor:pointer;padding:6px;border-radius:10px;transition:background .2s} .bell-wrap:hover{background:rgba(255,255,255,.12)} .bell-badge{position:absolute;top:0;right:0;background:var(--oa);color:#fff;font-size:10px;font-weight:700;min-width:18px;height:18px;border-radius:9px;display:flex;align-items:center;justify-content:center;padding:0 4px;animation:pulse 2s ease-in-out infinite;border:2px solid var(--gd)} .np-overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);backdrop-filter:blur(3px);z-index:900;animation:fadeIn .2s ease-out} .np{position:fixed;top:0;right:0;bottom:0;width:380px;max-width:92vw;background:var(--wh);z-index:901;box-shadow:-8px 0 40px rgba(0,0,0,.15);animation:slideRight .3s ease-out;display:flex;flex-direction:column} .np.closing{animation:slideOutRight .25s ease-in forwards} .np-head{padding:20px;border-bottom:1px solid var(--g2);display:flex;align-items:center;justify-content:space-between} .np-head h3{font-weight:700;font-size:16px;color:var(--bp)} .np-body{flex:1;overflow-y:auto;padding:8px 0} .np-item{padding:14px 20px;border-bottom:1px solid var(--g1);cursor:pointer;transition:background .15s} .np-item:hover{background:var(--g1)} .np-item.unread{background:var(--gl)} .np-item.unread:hover{background:#ddf5e8} .np-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0} .np-title{font-weight:600;font-size:13px;color:var(--bp)} .np-msg{font-weight:300;font-size:12px;color:var(--g7);margin-top:2px;line-height:1.4} .np-time{font-weight:400;font-size:10px;color:var(--g4);margin-top:4px} .np-empty{text-align:center;padding:40px 20px;color:var(--g4)} .main{flex:1;max-width:1140px;margin:0 auto;width:100%;padding:16px 16px 40px} .tabs{display:flex;gap:3px;background:var(--g1);border-radius:12px;padding:3px;margin-bottom:16px} .tab{flex:1;font-family:inherit;font-weight:600;font-size:13px;padding:9px 12px;border-radius:10px;border:none;background:transparent;color:var(--g4);cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:5px;white-space:nowrap} .tab:hover{color:var(--g7)} .tab.on{background:var(--wh);color:var(--gp);box-shadow:0 2px 8px rgba(0,103,56,.1)} .sbar{position:relative;margin-bottom:12px} .sbar input{width:100%;font-family:inherit;font-weight:400;font-size:14px;padding:11px 14px 11px 42px;border-radius:12px;border:2px solid var(--g2);background:var(--wh);color:var(--g7);outline:none;transition:all .2s} .sbar input:focus{border-color:var(--gp);box-shadow:0 0 0 3px rgba(0,103,56,.08)} .sbar input::placeholder{color:var(--g4)} .sbar .s-icon{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:var(--g4)} .chips{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px} .chip{font-family:inherit;font-weight:500;font-size:12px;padding:6px 14px;border-radius:20px;border:1.5px solid var(--g2);background:var(--wh);color:var(--g7);cursor:pointer;transition:all .2s} .chip:hover{border-color:var(--gp);color:var(--gp)} .chip.on{background:var(--gp);color:var(--wh);border-color:var(--gp)} .cgrid{display:grid;grid-template-columns:1fr;gap:14px} @media(min-width:600px){.cgrid{grid-template-columns:repeat(2,1fr)}} @media(min-width:920px){.cgrid{grid-template-columns:repeat(3,1fr)}} .card{background:var(--wh);border-radius:18px;box-shadow:0 4px 24px rgba(0,103,56,.08);overflow:hidden;transition:all .3s;animation:fadeIn .4s ease-out both} .card:hover{transform:translateY(-3px);box-shadow:0 8px 32px rgba(0,103,56,.14)} .card-strip{height:4px;width:100%} .card-b{padding:18px} .card-emo{width:46px;height:46px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:10px;position:relative} .card-emo::after{content:'';position:absolute;inset:0;border-radius:13px;background-image:repeating-conic-gradient(#0000000a 0% 25%,transparent 0% 50%);background-size:8px 8px} .card-name{font-weight:700;font-size:16px;color:var(--bp)} .card-role{font-weight:400;font-size:12px;color:var(--g4);margin-top:1px} .card-desc{font-weight:300;font-size:12px;color:var(--g7);line-height:1.5;margin:8px 0 12px} .card-bdg{display:inline-flex;align-items:center;gap:4px;font-weight:600;font-size:11px;padding:4px 10px;border-radius:8px;margin-bottom:12px} .slots-lbl{font-weight:600;font-size:11px;color:var(--g7);margin-bottom:6px;display:flex;align-items:center;gap:4px} .sgrid{display:flex;flex-wrap:wrap;gap:5px} .sc{font-family:inherit;font-weight:600;font-size:11px;padding:5px 9px;border-radius:7px;border:1.5px solid;cursor:pointer;transition:all .2s} .sc.av{background:var(--gl);border-color:var(--gp);color:var(--gp)} .sc.av:hover{background:var(--gp);color:var(--wh);transform:scale(1.06)} .sc.pn{background:var(--ol);border-color:var(--oa);color:#C44D00;cursor:default} .sc.tk,.sc.rj{background:#F0F0F0;border-color:#CCC;color:#AAA;cursor:default} .btn{font-family:inherit;font-weight:700;font-size:13px;padding:10px 20px;border-radius:10px;border:none;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;justify-content:center;gap:6px} .btn:active{transform:scale(.97)} .btn-p{background:var(--gp);color:var(--wh)}.btn-p:hover{background:var(--gd);box-shadow:0 4px 16px rgba(0,103,56,.25)} .btn-o{background:var(--oa);color:var(--wh)}.btn-o:hover{background:#C44D00;box-shadow:0 4px 16px rgba(232,93,0,.3)} .btn-g{background:transparent;color:var(--g7);border:2px solid var(--g2)}.btn-g:hover{border-color:var(--g4)} .btn-s{font-size:12px;padding:7px 14px;border-radius:8px} .btn-ac{background:var(--gl);color:var(--gp);border:1.5px solid var(--gp)}.btn-ac:hover{background:var(--gp);color:var(--wh)} .btn-rj{background:#FFF0F0;color:#D32F2F;border:1.5px solid #FFCDD2}.btn-rj:hover{background:#D32F2F;color:var(--wh)} .mo{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:1000;padding:16px;animation:fadeIn .2s ease-out} .mc{background:var(--wh);border-radius:20px;width:100%;max-width:420px;max-height:90vh;overflow-y:auto;animation:scaleIn .3s ease-out;box-shadow:0 24px 64px rgba(0,0,0,.2)} .mh{padding:22px 22px 0} .mh h3{font-weight:700;font-size:18px;color:var(--bp)} .mh p{font-weight:300;font-size:12px;color:var(--g4);margin-top:3px} .mb{padding:18px 22px} .mf{padding:0 22px 22px;display:flex;gap:10px} .fg{margin-bottom:14px} .fg label{font-weight:600;font-size:12px;color:var(--g7);display:block;margin-bottom:5px} .fg input,.fg textarea{width:100%;font-family:inherit;font-weight:400;font-size:14px;padding:10px 13px;border-radius:10px;border:2px solid var(--g2);background:var(--g1);color:var(--g7);outline:none;transition:all .2s} .fg input:focus,.fg textarea:focus{border-color:var(--gp);background:var(--wh);box-shadow:0 0 0 3px rgba(0,103,56,.08)} .fg textarea{resize:vertical;min-height:64px} .toast-c{position:fixed;top:14px;right:14px;z-index:2000;display:flex;flex-direction:column;gap:8px;max-width:340px} .toast{padding:12px 16px;border-radius:11px;font-family:inherit;font-weight:500;font-size:13px;color:var(--wh);box-shadow:0 8px 32px rgba(0,0,0,.18);display:flex;align-items:center;gap:8px;animation:toastIn .3s ease-out} .toast.out{animation:toastOut .3s ease-in forwards} .toast.ok{background:var(--gp)}.toast.info{background:var(--oa)}.toast.err{background:#D32F2F} .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px} .stat{background:var(--wh);border-radius:14px;padding:14px;text-align:center;box-shadow:0 2px 12px rgba(0,103,56,.06)} .stat-n{font-weight:700;font-size:26px;line-height:1} .stat-l{font-weight:400;font-size:10px;color:var(--g4);margin-top:3px} .ri{background:var(--wh);border-radius:14px;padding:14px;margin-bottom:10px;box-shadow:0 2px 12px rgba(0,103,56,.06);display:flex;align-items:center;gap:12px;transition:all .2s;animation:slideUp .3s ease-out both} .ri:hover{box-shadow:0 4px 20px rgba(0,103,56,.1)} .ri-time{font-weight:700;font-size:13px;color:var(--gp);background:var(--gl);padding:8px 10px;border-radius:9px;white-space:nowrap;min-width:54px;text-align:center} .ri-info{flex:1;min-width:0} .ri-name{font-weight:600;font-size:13px;color:var(--bp)} .ri-comp{font-weight:400;font-size:11px;color:var(--g4)} .ri-note{font-weight:300;font-size:11px;color:var(--g7);margin-top:3px;font-style:italic} .ri-acts{display:flex;gap:5px;flex-shrink:0} .tl{display:flex;gap:5px;overflow-x:auto;padding:4px 0 10px;margin-bottom:16px;-webkit-overflow-scrolling:touch} .tl::-webkit-scrollbar{height:3px}.tl::-webkit-scrollbar-thumb{background:var(--g2);border-radius:3px} .tl-s{min-width:74px;padding:8px 6px;border-radius:9px;text-align:center;flex-shrink:0} .tl-t{font-weight:600;font-size:11px;margin-bottom:3px} .tl-st{font-weight:400;font-size:9px} .atw{overflow-x:auto;background:var(--wh);border-radius:14px;box-shadow:0 2px 12px rgba(0,103,56,.06)} .at{width:100%;border-collapse:collapse;font-size:12px} .at th{font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.5px;color:var(--g4);padding:12px 10px;text-align:left;border-bottom:2px solid var(--g1);white-space:nowrap} .at td{padding:10px;border-bottom:1px solid var(--g1);color:var(--g7)} .at tr:hover td{background:var(--g1)} .sb{font-weight:600;font-size:10px;padding:3px 9px;border-radius:6px;display:inline-block;white-space:nowrap} .sb-p{background:var(--ol);color:#C44D00}.sb-a{background:var(--gl);color:var(--gp)}.sb-r{background:#F0F0F0;color:#999} .stitle{font-weight:700;font-size:17px;color:var(--bp);margin-bottom:14px;display:flex;align-items:center;gap:8px} .ssub{font-weight:300;font-size:12px;color:var(--g4);margin-top:-8px;margin-bottom:14px} .divider{height:5px;width:100%;background-image:repeating-conic-gradient(var(--bp) 0% 25%,transparent 0% 50%);background-size:5px 5px;opacity:.06;margin:18px 0} .login{max-width:380px;margin:36px auto;background:var(--wh);border-radius:20px;padding:32px 26px;box-shadow:0 8px 40px rgba(0,103,56,.1);text-align:center;animation:scaleIn .4s ease-out} .login h2{font-weight:700;font-size:20px;color:var(--gp);margin-bottom:4px} .login p{font-weight:300;font-size:12px;color:var(--g4);margin-bottom:20px} .mr{padding:12px 14px;border-radius:11px;margin-top:8px;display:flex;align-items:center;gap:10px;animation:fadeIn .3s ease-out both} .mr-n{padding:12px 16px;border-radius:11px;display:flex;align-items:flex-start;gap:10px;margin-bottom:8px;animation:fadeIn .3s ease-out both} .empty{text-align:center;padding:36px 20px;color:var(--g4)} .empty-i{font-size:44px;margin-bottom:10px;opacity:.5} .empty-t{font-weight:400;font-size:13px} .cfd{text-align:center;padding:6px 0} .cfd h3{font-weight:700;font-size:17px;color:var(--bp);margin-bottom:6px} .cfd p{font-weight:300;font-size:13px;color:var(--g7);margin-bottom:18px} .back{font-family:inherit;font-weight:500;font-size:12px;color:rgba(255,255,255,.7);cursor:pointer;background:none;border:none;padding:0;margin-bottom:6px;display:inline-flex;align-items:center;gap:3px;transition:color .2s} .back:hover{color:var(--wh)} .land-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;max-width:760px;margin:0 auto} .land-card{cursor:pointer;text-align:center;padding:26px 18px} .land-info{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;max-width:560px;margin:24px auto 0} .rbtn{font-family:inherit;font-weight:600;font-size:13px;padding:8px 18px;border-radius:10px;border:2px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:rgba(255,255,255,.8);cursor:pointer;transition:all .2s;white-space:nowrap} .rbtn:hover{background:rgba(255,255,255,.15);border-color:rgba(255,255,255,.4);color:var(--wh)} @media print{.hero,.toast-c,.np,.np-overlay{display:none!important}.main{padding:0!important}} @media(max-width:480px){.hero-title{font-size:19px}.stats{gap:6px}.stat-n{font-size:22px}.ri{flex-wrap:wrap}.ri-acts{width:100%;justify-content:flex-end;margin-top:6px}.np{width:100%;max-width:100%}}`;

// ═══════════════ TOAST HOOK ═══════════════

function Toasts({ items }: { items: any[] }) {
return (
<div className="toast-c">
{items.map((t: any) => (
<div key={t.id} className={`toast ${t.type} ${t.out ? "out" : ""}`}>
{t.icon} {t.msg}
</div>
))}
</div>
);
}

function useToast() {
const [items, setItems] = useState<any[]>([]);
const r = useRef(0);
const add = useCallback((msg: string, type: string = "ok") => {
const icons: any = { ok: "✅", info: "ℹ️", err: "❌" };
const id = ++r.current;
setItems((p) => [...p, { id, msg, type, icon: icons[type], out: false }]);
setTimeout(() => setItems((p) => p.map((t) => (t.id === id ? { ...t, out: true } : t))), 3500);
setTimeout(() => setItems((p) => p.filter((t) => t.id !== id)), 3800);
}, []);
return { items, add };
}

// ═══════════════ NOTIFICATION PANEL ═══════════════

function NotifPanel({ open, onClose, notifications, onMarkAllRead, onNotifClick }: any) {
const [closing, setClosing] = useState(false);
const handleClose = () => { setClosing(true); setTimeout(onClose, 250); };
useEffect(() => { if (open) setClosing(false); }, [open]);
if (!open) return null;

const iconMap: any = {
request_sent: { bg: "var(–gl)", icon: <Send size={16} color="var(--gp)" /> },
meeting_confirmed: { bg: "var(–gl)", icon: <CheckCheck size={16} color="var(--gp)" /> },
meeting_rejected: { bg: "#FFF0F0", icon: <XCircle size={16} color="#D32F2F" /> },
new_request: { bg: "var(–ol)", icon: <Bell size={16} color="var(--oa)" /> },
request_auto_rejected: { bg: "#FFF0F0", icon: <AlertCircle size={16} color="#D32F2F" /> },
meeting_created: { bg: "var(–ol)", icon: <CalendarDays size={16} color="var(--oa)" /> },
meeting_status_changed: { bg: "var(–gl)", icon: <Info size={16} color="var(--gp)" /> },
};
const sorted = [...notifications].sort((a: any, b: any) => b.timestamp - a.timestamp);
const unread = sorted.filter((n: any) => !n.read).length;

return (
<>
<div className="np-overlay" onClick={handleClose} />
<div className={`np ${closing ? "closing" : ""}`}>
<div className="np-head">
<h3>Notificaciones {unread > 0 && <span style={{ fontWeight: 400, fontSize: 12, color: "var(–g4)" }}>({unread} sin leer)</span>}</h3>
<div style={{ display: "flex", gap: 8, alignItems: "center" }}>
{unread > 0 && <button className="btn btn-s btn-g" onClick={onMarkAllRead} style={{ fontSize: 11 }}><CheckCheck size={14} /> Leer todo</button>}
<button onClick={handleClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={20} color="var(--g4)" /></button>
</div>
</div>
<div className="np-body">
{sorted.length === 0 ? (
<div className="np-empty"><div style={{ fontSize: 40, marginBottom: 8 }}>🔕</div><p>Sin notificaciones</p></div>
) : sorted.map((n: any) => {
const ic = iconMap[n.type] || iconMap.meeting_created;
return (
<div key={n.id} className={`np-item ${!n.read ? "unread" : ""}`} onClick={() => onNotifClick(n)}>
<div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
<div className="np-icon" style={{ background: ic.bg }}>{ic.icon}</div>
<div style={{ flex: 1 }}>
<div className="np-title">{n.title}</div>
<div className="np-msg">{n.message}</div>
<div className="np-time">{timeAgo(n.timestamp)}</div>
</div>
{!n.read && <div style={{ width: 8, height: 8, borderRadius: 4, background: "var(–oa)", marginTop: 4, flexShrink: 0 }} />}
</div>
</div>
);
})}
</div>
</div>
</>
);
}

// ═══════════════ BELL ═══════════════

function BellButton({ count, onClick }: any) {
return (
<div className="bell-wrap" onClick={onClick} role="button" aria-label={`${count} notificaciones`}>
<Bell size={22} color="white" />
{count > 0 && <div className="bell-badge">{count > 9 ? "9+" : count}</div>}
</div>
);
}

// ═══════════════ MODALS ═══════════════

function Modal({ open, onClose, children }: any) {
if (!open) return null;
return <div className="mo" onClick={onClose}><div className="mc" onClick={(e: any) => e.stopPropagation()}>{children}</div></div>;
}

function ConfirmModal({ open, onClose, onOk, title, msg, okText, danger }: any) {
return (
<Modal open={open} onClose={onClose}>
<div className="mb"><div className="cfd">
<div style={{ fontSize: 40, marginBottom: 8 }}>{danger ? "⚠️" : "✅"}</div>
<h3>{title}</h3><p>{msg}</p>
<div style={{ display: "flex", gap: 10 }}>
<button className="btn btn-g" style={{ flex: 1 }} onClick={onClose}>Cancelar</button>
<button className="btn" style={{ flex: 1, background: danger ? "#D32F2F" : "var(–gp)", color: "#fff", border: "none" }} onClick={onOk}>{okText}</button>
</div>
</div></div>
</Modal>
);
}

function BookingModal({ open, onClose, host, hostType, slot, onSubmit }: any) {
const [f, setF] = useState({ name: "", email: "", company: "", notes: "" });
const [busy, setBusy] = useState(false);
const [err, setErr] = useState("");

const handleSubmit = () => {
if (!f.name.trim() || !f.email.trim() || !f.company.trim()) { setErr("Completa todos los campos obligatorios"); return; }
if (!/\S+@\S+.\S+/.test(f.email)) { setErr("Ingresa un email válido"); return; }
setBusy(true);
setTimeout(() => {
onSubmit({ seller_name: f.name.trim(), seller_email: f.email.trim().toLowerCase(), seller_company: f.company.trim(), notes: f.notes.trim() });
setF({ name: "", email: "", company: "", notes: "" }); setErr(""); setBusy(false);
}, 500);
};

if (!host || !slot) return null;

return (
<Modal open={open} onClose={onClose}>
<div className="mh">
<h3>Solicitar reunión</h3>
<p>Con {host.name} · {hostType === "partner" ? `Stand #${host.stand_number}` : host.role} · {slot.start_time} - {slot.end_time}</p>
</div>
<div className="mb">
<div className="fg"><label>Nombre completo *</label><input value={f.name} onChange={(e: any) => { setF({ ...f, name: e.target.value }); setErr(""); }} placeholder="Tu nombre completo" /></div>
<div className="fg"><label>Email *</label><input type="email" value={f.email} onChange={(e: any) => { setF({ ...f, email: e.target.value }); setErr(""); }} placeholder="tu@email.com" /></div>
<div className="fg"><label>Empresa / Tienda *</label><input value={f.company} onChange={(e: any) => { setF({ ...f, company: e.target.value }); setErr(""); }} placeholder="Nombre de tu tienda" /></div>
<div className="fg"><label>Nota para el host (opcional)</label><textarea value={f.notes} onChange={(e: any) => setF({ ...f, notes: e.target.value })} placeholder="¿De qué te gustaría hablar?" /></div>
{err && <p style={{ fontWeight: 500, fontSize: 12, color: "#D32F2F", marginBottom: 10 }}>{err}</p>}
</div>
<div className="mf">
<button className="btn btn-g" style={{ flex: 1 }} onClick={onClose}>Cancelar</button>
<button className="btn btn-o" style={{ flex: 1 }} onClick={handleSubmit} disabled={busy}>{busy ? "Enviando..." : "🗓 Solicitar reunión"}</button>
</div>
</Modal>
);
}

// ═══════════════ SLOT CHIP ═══════════════

function SlotChip({ slot, status, onClick }: any) {
const cls = status === "available" ? "av" : status === "pending" ? "pn" : status === "accepted" ? "tk" : "rj";
return <button className={`sc ${cls}`} onClick={status === "available" ? onClick : undefined}>{slot.start_time}</button>;
}

// ═══════════════ CARDS ═══════════════

function PartnerCard({ partner, slots, meetings, avail, onSlot }: any) {
const getStatus = (s: any) => {
if (!avail.some((a: any) => a.host_id === partner.id && a.slot_id === s.id)) return "unavailable";
const m = meetings.find((x: any) => x.host_id === partner.id && x.slot_id === s.id && x.status !== "rejected");
return m ? m.status : "available";
};
const vis = slots.filter((s: any) => getStatus(s) !== "unavailable");
const free = vis.filter((s: any) => getStatus(s) === "available").length;

return (
<div className="card fi">
<div className="card-strip" style={{ background: partner.color_hex }} />
<div className="card-b">
<div className="card-emo" style={{ background: `${partner.color_hex}12` }}>{partner.logo_emoji}</div>
<div className="card-name">{partner.name}</div>
<div className="card-role">Stand #{partner.stand_number} · {partner.category}</div>
<div className="card-desc">{partner.description}</div>
<div className="card-bdg" style={{ background: free > 0 ? "var(–gl)" : "#F0F0F0", color: free > 0 ? "var(–gp)" : "#999" }}><Clock size={12} /> {free} disponible{free !== 1 ? "s" : ""}</div>
{vis.length > 0 && <>
<div className="slots-lbl"><Clock size={11} /> Horarios</div>
<div className="sgrid">{vis.map((s: any) => <SlotChip key={s.id} slot={s} status={getStatus(s)} onClick={() => onSlot(partner, "partner", s)} />)}</div>
</>}
</div>
</div>
);
}

function TeamCard({ member, slots, meetings, avail, onSlot }: any) {
const getStatus = (s: any) => {
if (!avail.some((a: any) => a.host_id === member.id && a.slot_id === s.id)) return "unavailable";
const m = meetings.find((x: any) => x.host_id === member.id && x.slot_id === s.id && x.status !== "rejected");
return m ? m.status : "available";
};
const vis = slots.filter((s: any) => getStatus(s) !== "unavailable");
const free = vis.filter((s: any) => getStatus(s) === "available").length;

return (
<div className="card fi">
<div className="card-strip" style={{ background: "linear-gradient(90deg,var(–gp),var(–gd))" }} />
<div className="card-b">
<div className="card-emo" style={{ background: "var(–gl)" }}>{member.emoji}</div>
<div className="card-name">{member.name}</div>
<div className="card-role">{member.role} · {member.area}</div>
<div className="card-bdg" style={{ background: free > 0 ? "var(–gl)" : "#F0F0F0", color: free > 0 ? "var(–gp)" : "#999" }}><Clock size={12} /> {free} disponible{free !== 1 ? "s" : ""}</div>
{vis.length > 0 && <>
<div className="slots-lbl"><Clock size={11} /> Horarios</div>
<div className="sgrid">{vis.map((s: any) => <SlotChip key={s.id} slot={s} status={getStatus(s)} onClick={() => onSlot(member, "team", s)} />)}</div>
</>}
</div>
</div>
);
}

// ═══════════════ SELLER VIEW ═══════════════

function SellerView({ meetings, avail, onBook, toast, notifications }: any) {
const [tab, setTab] = useState("partners");
const [q, setQ] = useState("");
const [catF, setCatF] = useState("Todas");
const [areaF, setAreaF] = useState("Todas");
const [bk, setBk] = useState<any>({ open: false, host: null, ht: null, slot: null });
const [myEmail, setMyEmail] = useState("");

const cats = ["Todas", ...new Set(PARTNERS.map((p) => p.category))];
const areas = ["Todas", ...new Set(TEAM.map((t) => t.area))];

const fp = PARTNERS.filter((p) => {
const mq = !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase());
return mq && (catF === "Todas" || p.category === catF);
});
const ft = TEAM.filter((t) => {
const mq = !q || t.name.toLowerCase().includes(q.toLowerCase()) || t.role.toLowerCase().includes(q.toLowerCase()) || t.area.toLowerCase().includes(q.toLowerCase());
return mq && (areaF === "Todas" || t.area === areaF);
});

const handleBook = (formData: any) => {
onBook({ host_id: bk.host.id, host_type: bk.ht, host_name: bk.host.name, slot_id: bk.slot.id, slot_time: bk.slot.start_time, ...formData });
setBk({ open: false, host: null, ht: null, slot: null });
};

const myMeetings = myEmail ? meetings.filter((m: any) => m.seller_email === myEmail.toLowerCase()) : [];
const myNotifs = myEmail ? notifications.filter((n: any) => n.recipient_type === "seller" && n.recipient_id === myEmail.toLowerCase()) : [];
const sc: any = { pending: { bg: "var(–ol)", c: "#C44D00", l: "Pendiente" }, accepted: { bg: "var(–gl)", c: "var(–gp)", l: "Confirmada" }, rejected: { bg: "#F0F0F0", c: "#999", l: "No disponible" } };

return (
<div>
<div className="tabs">
<button className={`tab ${tab === "partners" ? "on" : ""}`} onClick={() => setTab("partners")}><Building2 size={14} /> Partners</button>
<button className={`tab ${tab === "team" ? "on" : ""}`} onClick={() => setTab("team")}><Users size={14} /> Equipo</button>
<button className={`tab ${tab === "mine" ? "on" : ""}`} onClick={() => setTab("mine")}><CalendarDays size={14} /> Mis Reuniones</button>
</div>


  {tab === "mine" ? (
    <div className="su">
      <div style={{ background: "var(--wh)", borderRadius: 16, padding: 20, boxShadow: "0 4px 24px rgba(0,103,56,.08)", marginBottom: 16 }}>
        <div className="stitle"><CalendarDays size={18} /> Mis Reuniones</div>
        <p style={{ fontWeight: 300, fontSize: 12, color: "var(--g4)", marginBottom: 14 }}>Ingresa tu email para ver tus solicitudes y notificaciones</p>
        <div className="fg" style={{ marginBottom: 0 }}><input type="email" value={myEmail} onChange={(e: any) => setMyEmail(e.target.value)} placeholder="tu@email.com" /></div>
      </div>
      {myEmail && myNotifs.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div className="stitle" style={{ fontSize: 15 }}><Bell size={16} /> Notificaciones</div>
          {myNotifs.sort((a: any, b: any) => b.timestamp - a.timestamp).map((n: any) => {
            const isGood = n.type === "meeting_confirmed";
            const isBad = n.type === "meeting_rejected";
            const bg = isGood ? "var(--gl)" : isBad ? "#FFF0F0" : "var(--ol)";
            const bc = isGood ? "var(--gp)" : isBad ? "#FFCDD2" : "var(--oa)";
            return (
              <div key={n.id} className="mr-n" style={{ background: bg, border: `1.5px solid ${bc}20` }}>
                <div style={{ fontSize: 18, flexShrink: 0 }}>{isGood ? "✅" : isBad ? "❌" : "📨"}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "var(--bp)" }}>{n.title}</div>
                  <div style={{ fontWeight: 300, fontSize: 12, color: "var(--g7)", marginTop: 2 }}>{n.message}</div>
                  <div style={{ fontWeight: 400, fontSize: 10, color: "var(--g4)", marginTop: 3 }}>{timeAgo(n.timestamp)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {myEmail && myMeetings.length === 0 && myNotifs.length === 0 && (
        <div className="empty"><div className="empty-i">📭</div><div className="empty-t">No se encontraron reuniones para este email</div></div>
      )}
      {myMeetings.sort((a: any, b: any) => a.slot_time.localeCompare(b.slot_time)).map((m: any) => {
        const s = sc[m.status] || sc.pending;
        return (
          <div key={m.id} className="mr" style={{ background: s.bg, border: `1.5px solid ${s.c}20` }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: s.c, minWidth: 48 }}>{m.slot_time}</div>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13, color: "var(--bp)" }}>{m.host_name}</div><div style={{ fontWeight: 400, fontSize: 11, color: "var(--g4)" }}>{m.host_type === "partner" ? "Partner" : "Equipo Falabella"}</div></div>
            <div className={`sb sb-${m.status[0]}`}>{s.l}</div>
          </div>
        );
      })}
    </div>
  ) : (
    <>
      <div className="sbar"><Search size={18} className="s-icon" /><input value={q} onChange={(e: any) => setQ(e.target.value)} placeholder={tab === "partners" ? "Buscar partner, categoría..." : "Buscar nombre, cargo, área..."} /></div>
      <div className="chips">
        {tab === "partners" ? cats.map((c: any) => <button key={c} className={`chip ${catF === c ? "on" : ""}`} onClick={() => setCatF(c)}>{c}</button>)
          : areas.map((a: any) => <button key={a} className={`chip ${areaF === a ? "on" : ""}`} onClick={() => setAreaF(a)}>{a}</button>)}
      </div>
      <div className="cgrid">
        {tab === "partners" ? (
          fp.length ? fp.map((p) => <PartnerCard key={p.id} partner={p} slots={SLOTS} meetings={meetings} avail={avail} onSlot={(h: any, ht: any, s: any) => setBk({ open: true, host: h, ht, slot: s })} />)
            : <div className="empty" style={{ gridColumn: "1/-1" }}><div className="empty-i">🔍</div><div className="empty-t">No se encontraron partners</div></div>
        ) : (
          ft.length ? ft.map((t) => <TeamCard key={t.id} member={t} slots={SLOTS} meetings={meetings} avail={avail} onSlot={(h: any, ht: any, s: any) => setBk({ open: true, host: h, ht, slot: s })} />)
            : <div className="empty" style={{ gridColumn: "1/-1" }}><div className="empty-i">🔍</div><div className="empty-t">No se encontraron miembros</div></div>
        )}
      </div>
    </>
  )}
  <BookingModal open={bk.open} onClose={() => setBk({ open: false, host: null, ht: null, slot: null })} host={bk.host} hostType={bk.ht} slot={bk.slot} onSubmit={handleBook} />
</div>


);
}

// ═══════════════ TEAM DASHBOARD ═══════════════

function TeamDash({ user, meetings, avail, onAccept, onReject, toast, onLogout, notifications }: any) {
const [cfm, setCfm] = useState<any>(null);
const my = meetings.filter((m: any) => m.host_id === user.id && m.host_type === "team");
const pend = my.filter((m: any) => m.status === "pending");
const acpt = my.filter((m: any) => m.status === "accepted");
const mySlots = avail.filter((a: any) => a.host_id === user.id && a.host_type === "team");

const tlInfo = (s: any) => {
const m = my.find((x: any) => x.slot_id === s.id && x.status === "accepted");
const p = my.find((x: any) => x.slot_id === s.id && x.status === "pending");
const av = mySlots.some((a: any) => a.slot_id === s.id);
if (m) return { t: "a", l: m.seller_name.split(" ")[0] };
if (p) return { t: "p", l: "Pendiente" };
if (av) return { t: "f", l: "Libre" };
return { t: "u", l: "—" };
};
const tlC: any = { a: { bg: "var(–gp)", c: "#fff" }, p: { bg: "var(–ol)", c: "#C44D00" }, f: { bg: "var(–gl)", c: "var(–gp)" }, u: { bg: "var(–g1)", c: "var(–g4)" } };

return (
<div className="su">
<div style={{ background: "var(–wh)", borderRadius: 16, padding: "16px 18px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,103,56,.06)" }}>
<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
<div style={{ width: 44, height: 44, borderRadius: 12, background: "var(–gl)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{user.emoji}</div>
<div style={{ flex: 1 }}>
<div style={{ fontWeight: 700, fontSize: 17, color: "var(–bp)" }}>Hola, {user.name.split(" ")[0]}</div>
<div style={{ fontWeight: 300, fontSize: 12, color: "var(–g4)" }}>{user.role} · {user.area}</div>
</div>
<button className="btn btn-g btn-s" onClick={onLogout}><LogOut size={14} /> Salir</button>
</div>
</div>
<div className="stats">
<div className="stat"><div className="stat-n" style={{ color: "var(–gp)" }}>{mySlots.length}</div><div className="stat-l">Slots</div></div>
<div className="stat" style={{ position: "relative" }}><div className="stat-n" style={{ color: "var(–oa)" }}>{pend.length}</div><div className="stat-l">Pendientes</div>{pend.length > 0 && <div style={{ position: "absolute", top: 6, right: 6, background: "var(–oa)", color: "#fff", fontSize: 10, fontWeight: 700, minWidth: 18, height: 18, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px", animation: "pulse 2s ease-in-out infinite" }}>{pend.length}</div>}</div>
<div className="stat"><div className="stat-n" style={{ color: "var(–gd)" }}>{acpt.length}</div><div className="stat-l">Confirmadas</div></div>
</div>
<div className="stitle"><CalendarDays size={16} /> Tu agenda del día</div>
<div className="tl">
{SLOTS.map((s) => { const i = tlInfo(s); const c = tlC[i.t]; return <div key={s.id} className="tl-s" style={{ background: c.bg, color: c.c }}><div className="tl-t">{s.start_time}</div><div className="tl-st">{i.l}</div></div>; })}
</div>
<div className="stitle"><Bell size={16} /> Solicitudes pendientes {pend.length > 0 && <span style={{ background: "var(–oa)", color: "#fff", fontSize: 10, fontWeight: 700, minWidth: 20, height: 20, borderRadius: 10, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 6px", animation: "pulse 2s ease-in-out infinite" }}>{pend.length}</span>}</div>
{pend.length === 0 ? <div className="empty"><div className="empty-i">✨</div><div className="empty-t">No tienes solicitudes pendientes</div></div>
: pend.sort((a: any, b: any) => a.slot_time.localeCompare(b.slot_time)).map((m: any) => (
<div key={m.id} className="ri">
<div className="ri-time">{m.slot_time}</div>
<div className="ri-info"><div className="ri-name">{m.seller_name}</div><div className="ri-comp">{m.seller_company} · {m.seller_email}</div>{m.notes && <div className="ri-note">"{m.notes}"</div>}</div>
<div className="ri-acts">
<button className="btn btn-ac btn-s" onClick={() => setCfm({ type: "accept", m, title: "Confirmar reunión", msg: `¿Confirmar reunión con ${m.seller_name} de ${m.seller_company} a las ${m.slot_time}?`, ok: "✅ Confirmar" })}><Check size={14} /></button>
<button className="btn btn-rj btn-s" onClick={() => setCfm({ type: "reject", m, title: "Rechazar solicitud", msg: `¿Rechazar solicitud de ${m.seller_name}?`, ok: "Rechazar" })}><X size={14} /></button>
</div>
</div>
))}
<div className="divider" />
<div className="stitle"><CheckCheck size={16} /> Reuniones confirmadas</div>
{acpt.length === 0 ? <div className="empty"><div className="empty-i">📭</div><div className="empty-t">Aún no tienes reuniones confirmadas</div></div>
: acpt.sort((a: any, b: any) => a.slot_time.localeCompare(b.slot_time)).map((m: any) => (
<div key={m.id} className="ri" style={{ borderLeft: "3px solid var(–gp)" }}>
<div className="ri-time">{m.slot_time}</div>
<div className="ri-info"><div className="ri-name">{m.seller_name}</div><div className="ri-comp">{m.seller_company}</div></div>
<div className="sb sb-a">Confirmada</div>
</div>
))}
<ConfirmModal open={!!cfm} onClose={() => setCfm(null)} title={cfm?.title || ""} msg={cfm?.msg || ""} okText={cfm?.ok || ""} danger={cfm?.type === "reject"} onOk={() => {
if (cfm.type === "accept") { onAccept(cfm.m.id); toast.add(`Reunión con ${cfm.m.seller_name} confirmada`, "ok"); }
else { onReject(cfm.m.id); toast.add(`Solicitud de ${cfm.m.seller_name} rechazada`, "info"); }
setCfm(null);
}} />
</div>
);
}

// ═══════════════ ADMIN VIEW ═══════════════

function AdminView({ meetings, onAccept, onReject, toast, notifications }: any) {
const [fil, setFil] = useState("all");
const [q, setQ] = useState("");
const [cfm, setCfm] = useState<any>(null);

const total = meetings.length;
const accepted = meetings.filter((m: any) => m.status === "accepted").length;
const rejected = meetings.filter((m: any) => m.status === "rejected").length;
const pending = meetings.filter((m: any) => m.status === "pending").length;

const hourData = SLOTS.map((s) => ({ time: s.start_time, count: meetings.filter((m: any) => m.slot_time === s.start_time).length }));
const hostMap: any = {};
meetings.forEach((m: any) => { hostMap[m.host_name] = (hostMap[m.host_name] || 0) + 1; });
const topHosts = Object.entries(hostMap).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5);

const filtered = meetings.filter((m: any) => {
const ms = fil === "all" || m.status === fil;
const mq = !q || m.seller_name.toLowerCase().includes(q.toLowerCase()) || m.host_name.toLowerCase().includes(q.toLowerCase()) || m.seller_company.toLowerCase().includes(q.toLowerCase());
return ms && mq;
}).sort((a: any, b: any) => a.slot_time.localeCompare(b.slot_time));

const exportCSV = () => {
const header = "Hora,Seller,Email,Empresa,Host,Tipo,Estado,Notas\n";
const rows = meetings.map((m: any) => `${m.slot_time},"${m.seller_name}","${m.seller_email}","${m.seller_company}","${m.host_name}",${m.host_type === "partner" ? "Partner" : "Equipo"},${m.status},"${m.notes || ""}"`).join("\n");
const blob = new Blob(["\uFEFF" + header + rows], { type: "text/csv;charset=utf-8;" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a"); a.href = url; a.download = "seller-day-2026-reuniones.csv"; a.click();
URL.revokeObjectURL(url);
toast.add("CSV descargado", "ok");
};

return (
<div className="su">
<div className="stitle"><TrendingUp size={18} /> Panel de Administración</div>
<div className="ssub">Métricas en tiempo real del Seller Day 2026</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 18 }}>
<div className="stat"><div className="stat-n" style={{ color: "var(–bp)" }}>{total}</div><div className="stat-l">Total</div></div>
<div className="stat"><div className="stat-n" style={{ color: "var(–gp)" }}>{accepted}</div><div className="stat-l">Aceptadas</div></div>
<div className="stat"><div className="stat-n" style={{ color: "var(–oa)" }}>{pending}</div><div className="stat-l">Pendientes</div></div>
<div className="stat"><div className="stat-n" style={{ color: "var(–g4)" }}>{rejected}</div><div className="stat-l">Rechazadas</div></div>
</div>
<div style={{ background: "var(–wh)", borderRadius: 14, padding: "16px 12px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,103,56,.06)" }}>
<div style={{ fontWeight: 600, fontSize: 13, color: "var(–bp)", marginBottom: 10, paddingLeft: 4 }}>Reuniones por horario</div>
<ResponsiveContainer width="100%" height={160}>
<BarChart data={hourData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
<XAxis dataKey="time" tick={{ fontSize: 9, fontFamily: "Poppins", fill: "#AAA" }} axisLine={false} tickLine={false} />
<YAxis tick={{ fontSize: 9, fontFamily: "Poppins", fill: "#AAA" }} axisLine={false} tickLine={false} allowDecimals={false} />
<Tooltip contentStyle={{ fontFamily: "Poppins", fontSize: 12, borderRadius: 8, border: "1px solid #E8E8E8" }} />
<Bar dataKey="count" radius={[4, 4, 0, 0]} name="Reuniones">{hourData.map((_: any, i: number) => <Cell key={i} fill={i % 2 === 0 ? "#006738" : "#004825"} />)}</Bar>
</BarChart>
</ResponsiveContainer>
</div>
{topHosts.length > 0 && (
<div style={{ background: "var(–wh)", borderRadius: 14, padding: 16, marginBottom: 16, boxShadow: "0 2px 12px rgba(0,103,56,.06)" }}>
<div style={{ fontWeight: 600, fontSize: 13, color: "var(–bp)", marginBottom: 10 }}>🏆 Más solicitados</div>
{topHosts.map(([name, count]: any, i: number) => (
<div key={name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: i < topHosts.length - 1 ? "1px solid var(–g1)" : "none" }}>
<div style={{ fontWeight: 700, fontSize: 13, color: "var(–gp)", width: 22 }}>#{i + 1}</div>
<div style={{ flex: 1, fontWeight: 500, fontSize: 12 }}>{name}</div>
<div style={{ fontWeight: 700, fontSize: 12, color: "var(–oa)" }}>{count}</div>
</div>
))}
</div>
)}
<div className="divider" />
<div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
<button className="btn btn-p btn-s" onClick={() => { window.print(); toast.add("Preparando impresión...", "info"); }}><Printer size={14} /> Imprimir PDF</button>
<button className="btn btn-o btn-s" onClick={exportCSV}><Download size={14} /> Exportar CSV</button>
</div>
<div className="stitle"><ClipboardList size={16} /> Todas las reuniones</div>
<div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
{[["all", "Todas"], ["pending", "Pendientes"], ["accepted", "Aceptadas"], ["rejected", "Rechazadas"]].map(([k, v]) => (
<button key={k} className={`chip ${fil === k ? "on" : ""}`} onClick={() => setFil(k)}>{v}</button>
))}
</div>
<div className="sbar" style={{ marginBottom: 14 }}><Search size={18} className="s-icon" /><input value={q} onChange={(e: any) => setQ(e.target.value)} placeholder="Buscar seller, host, empresa..." /></div>
<div className="atw">
<table className="at">
<thead><tr><th>Hora</th><th>Seller</th><th>Empresa</th><th>Host</th><th>Tipo</th><th>Estado</th><th>Acciones</th></tr></thead>
<tbody>
{filtered.length === 0 ? <tr><td colSpan={7} style={{ textAlign: "center", padding: 28, color: "var(–g4)" }}>Sin resultados</td></tr>
: filtered.map((m: any) => (
<tr key={m.id}>
<td style={{ fontWeight: 600 }}>{m.slot_time}</td>
<td>{m.seller_name}</td><td>{m.seller_company}</td>
<td style={{ fontWeight: 500 }}>{m.host_name}</td>
<td>{m.host_type === "partner" ? "🏢" : "👤"}</td>
<td><span className={`sb sb-${m.status[0]}`}>{{ pending: "Pendiente", accepted: "Aceptada", rejected: "Rechazada" }[m.status as string]}</span></td>
<td>{m.status === "pending" && <div style={{ display: "flex", gap: 3 }}>
<button className="btn btn-ac btn-s" style={{ padding: "3px 8px" }} onClick={() => setCfm({ type: "accept", m, title: "Confirmar", msg: `Confirmar ${m.seller_name} con ${m.host_name}`, ok: "Confirmar" })}><Check size={12} /></button>
<button className="btn btn-rj btn-s" style={{ padding: "3px 8px" }} onClick={() => setCfm({ type: "reject", m, title: "Rechazar", msg: `Rechazar ${m.seller_name}`, ok: "Rechazar" })}><X size={12} /></button>
</div>}</td>
</tr>
))}
</tbody>
</table>
</div>
<ConfirmModal open={!!cfm} onClose={() => setCfm(null)} title={cfm?.title || ""} msg={cfm?.msg || ""} okText={cfm?.ok || ""} danger={cfm?.type === "reject"} onOk={() => {
if (cfm.type === "accept") { onAccept(cfm.m.id); toast.add("Reunión aceptada", "ok"); }
else { onReject(cfm.m.id); toast.add("Solicitud rechazada", "info"); }
setCfm(null);
}} />
</div>
);
}

// ═══════════════ TEAM LOGIN ═══════════════

function TeamLogin({ onLogin }: any) {
const [email, setEmail] = useState("");
const [err, setErr] = useState("");
const [busy, setBusy] = useState(false);

const go = () => {
setErr("");
const m = TEAM.find((t) => t.email.toLowerCase() === email.toLowerCase().trim());
if (!m) { setErr("Email no registrado. Solo miembros del equipo Falabella."); return; }
setBusy(true);
setTimeout(() => { onLogin(m); setBusy(false); }, 600);
};

return (
<div className="login si">
<div style={{ fontSize: 44, marginBottom: 10 }}>🔐</div>
<h2>Equipo Falabella</h2>
<p>Ingresa con tu email corporativo para gestionar tu agenda</p>
<div className="fg" style={{ textAlign: "left" }}>
<label>Email @falabella.com</label>
<input type="email" value={email} onChange={(e: any) => { setEmail(e.target.value); setErr(""); }} placeholder="nombre@falabella.com" onKeyDown={(e: any) => e.key === "Enter" && go()} />
</div>
{err && <p style={{ fontWeight: 500, fontSize: 11, color: "#D32F2F", marginBottom: 10 }}>{err}</p>}
<p style={{ fontWeight: 300, fontSize: 11, color: "var(–g4)", marginBottom: 14 }}>
Demo: <span style={{ fontWeight: 600, cursor: "pointer", color: "var(–gp)" }} onClick={() => setEmail("roberto.sanchez@falabella.com")}>roberto.sanchez@falabella.com</span>
</p>
<button className="btn btn-p" style={{ width: "100%" }} onClick={go} disabled={!email.trim() || busy}>{busy ? "Verificando..." : "Ingresar"}</button>
</div>
);
}

// ═══════════════ MAIN APP ═══════════════

export default function App() {
// ── TODOS LOS HOOKS JUNTOS AL INICIO ──
const [view, setView] = useState("landing");
const [avail] = useState(buildAvailability);
const [meetings, setMeetings] = useState<any[]>(SEED_MEETINGS);
const [notifications, setNotifications] = useState<any[]>(SEED_NOTIFS);
const [user, setUser] = useState<any>(null);
const [npOpen, setNpOpen] = useState(false);
const toast = useToast();

// ── NOTIFICACIONES ──
const addNotif = useCallback((n: any) => {
setNotifications((prev) => [{ ...n, id: uid(), timestamp: Date.now(), read: false }, ...prev]);
}, []);

// ── CREAR REUNIÓN ──
const handleBook = useCallback((data: any) => {
const id = uid();
setMeetings((prev) => [...prev, { ...data, id, status: "pending", created_at: Date.now() }]);
addNotif({ type: "request_sent", title: "Solicitud enviada", message: `Tu solicitud con ${data.host_name} a las ${data.slot_time} fue enviada.`, recipient_type: "seller", recipient_id: data.seller_email, meeting_id: id });
if (data.host_type === "team") {
addNotif({ type: "new_request", title: "Nueva solicitud", message: `${data.seller_name} de ${data.seller_company} quiere reunirse contigo a las ${data.slot_time}.`, recipient_type: "team", recipient_id: data.host_id, meeting_id: id });
}
addNotif({ type: "meeting_created", title: "Nueva solicitud", message: `${data.seller_name} → ${data.host_name} a las ${data.slot_time}`, recipient_type: "admin", recipient_id: "admin", meeting_id: id });
toast.add("Solicitud de reunión enviada exitosamente", "ok");
}, [addNotif, toast]);

// ── ACEPTAR ──
const handleAccept = useCallback((meetingId: string) => {
let target: any = null;
setMeetings((prev) => {
target = prev.find((m) => m.id === meetingId);
if (!target) return prev;
return prev.map((m) => {
if (m.id === meetingId) return { ...m, status: "accepted" };
if (m.host_id === target.host_id && m.slot_id === target.slot_id && m.status === "pending" && m.id !== meetingId) {
setTimeout(() => {
addNotif({ type: "meeting_rejected", title: "Solicitud no confirmada", message: `Tu solicitud con ${m.host_name} a las ${m.slot_time} no pudo ser confirmada.`, recipient_type: "seller", recipient_id: m.seller_email, meeting_id: m.id });
}, 0);
return { ...m, status: "rejected" };
}
return m;
});
});
setTimeout(() => {
if (!target) return;
const host: any = [...PARTNERS, ...TEAM].find((h) => h.id === target.host_id);
const loc = target.host_type === "partner" ? `Stand #${host?.stand_number || "?"}` : "Mesa de reuniones";
addNotif({ type: "meeting_confirmed", title: "¡Reunión confirmada!", message: `${target.host_name} te espera a las ${target.slot_time} en ${loc}.`, recipient_type: "seller", recipient_id: target.seller_email, meeting_id: meetingId });
addNotif({ type: "meeting_status_changed", title: "Reunión aceptada", message: `${target.host_name} aceptó reunión con ${target.seller_name} a las ${target.slot_time}`, recipient_type: "admin", recipient_id: "admin", meeting_id: meetingId });
}, 0);
}, [addNotif]);

// ── RECHAZAR ──
const handleReject = useCallback((meetingId: string) => {
let target: any = null;
setMeetings((prev) => {
target = prev.find((m) => m.id === meetingId);
return prev.map((m) => (m.id === meetingId ? { ...m, status: "rejected" } : m));
});
setTimeout(() => {
if (!target) return;
addNotif({ type: "meeting_rejected", title: "Solicitud no confirmada", message: `Tu solicitud con ${target.host_name} a las ${target.slot_time} no pudo ser confirmada.`, recipient_type: "seller", recipient_id: target.seller_email, meeting_id: meetingId });
addNotif({ type: "meeting_status_changed", title: "Reunión rechazada", message: `${target.host_name} rechazó reunión con ${target.seller_name} a las ${target.slot_time}`, recipient_type: "admin", recipient_id: "admin", meeting_id: meetingId });
}, 0);
}, [addNotif]);

// ── MARCAR LEÍDAS ──
const markAllRead = useCallback((rt: string, ri: string) => {
setNotifications((prev) => prev.map((n) => (n.recipient_type === rt && n.recipient_id === ri ? { ...n, read: true } : n)));
}, []);

// ── NOTIFS FILTRADAS ──
const getNotifs = () => {
if (view === "team-dash" && user) return notifications.filter((n) => n.recipient_type === "team" && n.recipient_id === user.id);
if (view === "admin") return notifications.filter((n) => n.recipient_type === "admin");
return [];
};
const currentNotifs = getNotifs();
const unreadCount = currentNotifs.filter((n) => !n.read).length;
const showBell = view === "team-dash" || view === "admin";

const heroSub: any = {
landing: "Conecta con partners y el equipo Falabella Marketplace",
seller: "Agenda tu reunión con partners y equipo Falabella",
team: "Panel del equipo Falabella — gestiona tu agenda",
"team-dash": "Panel del equipo Falabella — gestiona tu agenda",
admin: "Panel de administración — métricas y gestión",
};

// ── RENDER ──
return (
<>
<style>{CSS}</style>
<div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
<Toasts items={toast.items} />
<NotifPanel
open={npOpen}
onClose={() => setNpOpen(false)}
notifications={currentNotifs}
onMarkAllRead={() => {
if (view === "team-dash" && user) markAllRead("team", user.id);
if (view === "admin") markAllRead("admin", "admin");
}}
onNotifClick={(n: any) => setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
/>


    <header className="hero">
      <div className="hero-in">
        {view !== "landing" && <button className="back" onClick={() => { setView("landing"); setUser(null); }}><ArrowLeft size={14} /> Volver al inicio</button>}
        <div className="hero-row">
          <div className="hero-brand">
            <div className="hero-logo">F</div>
            <div><div className="hero-title">Seller Day <span>2026</span></div><div className="hero-sub">{heroSub[view]}</div></div>
          </div>
          <div className="hero-actions">{showBell && <BellButton count={unreadCount} onClick={() => setNpOpen(true)} />}</div>
        </div>
        {view === "landing" && (
          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            <button className="rbtn" onClick={() => setView("seller")}>🛍️ Soy Seller</button>
            <button className="rbtn" onClick={() => setView("team")}>👤 Equipo Falabella</button>
            <button className="rbtn" onClick={() => setView("admin")}>⚙️ Administrador</button>
          </div>
        )}
      </div>
    </header>

    {view === "landing" && (
      <div className="main">
        <div style={{ textAlign: "center", padding: "32px 16px" }} className="fi">
          <div style={{ fontSize: 56, marginBottom: 14 }}>🤝</div>
          <h2 style={{ fontWeight: 700, fontSize: 22, color: "var(--gp)", marginBottom: 6 }}>Bienvenido al Seller Day 2026</h2>
          <p style={{ fontWeight: 300, fontSize: 14, color: "var(--g7)", maxWidth: 460, margin: "0 auto 28px", lineHeight: 1.6 }}>Agenda reuniones 1:1 con nuestros partners y el equipo de Falabella Marketplace.</p>
          <div className="land-cards">
            {[
              { v: "seller", icon: "🛍️", t: "Soy Seller", d: "Explora la agenda y solicita reuniones" },
              { v: "team", icon: "👤", t: "Equipo Falabella", d: "Gestiona tu agenda de reuniones" },
              { v: "admin", icon: "⚙️", t: "Administrador", d: "Dashboard, métricas y exportación" },
            ].map((c) => (
              <div key={c.v} className="card land-card" onClick={() => setView(c.v)}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>{c.icon}</div>
                <div className="card-name">{c.t}</div>
                <div className="card-desc" style={{ marginBottom: 0 }}>{c.d}</div>
              </div>
            ))}
          </div>
          <div className="divider" />
          <div className="land-info">
            {[{ i: "📍", v: "Santiago, Chile", l: "Presencial" }, { i: "📅", v: "2026", l: "Fecha" }, { i: "👥", v: "~800 sellers", l: "Asistentes" }, { i: "🏢", v: "15 empresas", l: "Partners" }].map((x) => (
              <div key={x.l} style={{ textAlign: "center", padding: 10 }}>
                <div style={{ fontSize: 22, marginBottom: 3 }}>{x.i}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "var(--gp)" }}>{x.v}</div>
                <div style={{ fontWeight: 300, fontSize: 10, color: "var(--g4)" }}>{x.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}

    {view !== "landing" && (
      <div className="main">
        {view === "seller" && <SellerView meetings={meetings} avail={avail} onBook={handleBook} toast={toast} notifications={notifications} />}
        {view === "team" && !user && <TeamLogin onLogin={(m: any) => { setUser(m); setView("team-dash"); toast.add(`Bienvenido/a, ${m.name.split(" ")[0]}`, "ok"); }} />}
        {view === "team-dash" && user && <TeamDash user={user} meetings={meetings} avail={avail} onAccept={handleAccept} onReject={handleReject} toast={toast} onLogout={() => { setUser(null); setView("landing"); toast.add("Sesión cerrada", "info"); }} notifications={notifications} />}
        {view === "admin" && <AdminView meetings={meetings} onAccept={handleAccept} onReject={handleReject} toast={toast} notifications={notifications} />}
      </div>
    )}

    <footer style={{ textAlign: "center", padding: 18, borderTop: "1px solid var(--g2)" }}>
      <div style={{ fontWeight: 300, fontSize: 10, color: "var(--g4)" }}>Seller Day 2026 · Falabella Marketplace · Hecho con 💚</div>
    </footer>
  </div>
</>


);
}
