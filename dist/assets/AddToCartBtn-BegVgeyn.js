import{b as o,u,j as f,v as x,_ as e}from"./index-D9YnBNb_.js";function p({info:d,resInfo:a,handleIsDiffRes:s}){const n=o(t=>t.cartSlice.cartItems),r=o(t=>t.cartSlice.resInfo),c=u();function i(){n.find(l=>l.id===d.id)?e.error("Already added "):r.name===a.name||r.length===0?(c(x({info:d,resInfo:a})),e.success("food added to the cart")):(e.error("different restaurant "),s())}return f.jsx("button",{onClick:i,className:"bg-white absolute bottom-[-20px] left-1/2  -translate-x-1/2 text-lg text-green-700 font-bold rounded-xl border px-10 py-2 drop-shadow",children:"Add"})}export{p as A};
