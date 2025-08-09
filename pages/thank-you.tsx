import Head from "next/head";
import Link from "next/link";

export default function ThankYou() {
  return (
    <>
      <Head><title>Thank you — Myelin Map</title></Head>
      <main style={{minHeight:"60vh",display:"grid",placeItems:"center",background:"#0b1220",color:"#fff"}}>
        <div style={{textAlign:"center",padding:"2rem"}}>
          <h1 style={{fontSize:"2rem",marginBottom:"0.5rem"}}>Thank you for the coffee ☕</h1>
          <p style={{color:"#cbd5e1",marginBottom:"1rem"}}>Your support helps me keep building tools that heal.</p>
          <Link href="/"><a style={{padding:"10px 14px",borderRadius:10,background:"#10b981",color:"#062019",fontWeight:700}}>Back to Home</a></Link>
        </div>
      </main>
    </>
  );
}
