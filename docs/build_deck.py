import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    blank_layout = prs.slide_layouts[6]

    # Color Palette
    BG_COLOR = RGBColor(8, 11, 17)        # Void Stealth #080B11
    PANEL_BG = RGBColor(13, 18, 29)       # Panel #0D121D
    CARD_BG = RGBColor(16, 23, 38)        # Card #101726
    TEXT_WHITE = RGBColor(248, 250, 252)  # #F8FAFC
    TEXT_SLATE = RGBColor(148, 163, 184)  # #94A3B8
    TEXT_MUTED = RGBColor(100, 116, 139)  # #64748B
    ACCENT_RED = RGBColor(244, 63, 94)    # Crimson #F43F5E
    ACCENT_CYAN = RGBColor(0, 240, 255)   # Cyan #00F0FF
    ACCENT_GREEN = RGBColor(16, 185, 129) # Emerald #10B981
    ACCENT_AMBER = RGBColor(245, 158, 11) # Amber #F59E0B

    def add_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_COLOR
        bg.line.fill.background()
        return bg

    def add_header(slide, title_text, category_text="BFSI DEFENSE // MISSION CONTROL"):
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.733), Inches(0.9))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        p_cat = tf.paragraphs[0]
        p_cat.text = category_text.upper()
        p_cat.font.name = "Consolas"
        p_cat.font.size = Pt(10)
        p_cat.font.bold = True
        p_cat.font.color.rgb = ACCENT_CYAN
        
        p_title = tf.add_paragraph()
        p_title.text = title_text
        p_title.font.name = "Arial"
        p_title.font.size = Pt(22)
        p_title.font.bold = True
        p_title.font.color.rgb = TEXT_WHITE

    assets_dir = os.path.join(os.path.dirname(__file__), "slides_assets")

    # ==========================================
    # SLIDE 1: Cover
    # ==========================================
    slide1 = prs.slides.add_slide(blank_layout)
    add_bg(slide1)
    
    # Accent top border
    bar = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.8), Inches(2.5), Inches(0.08))
    bar.fill.solid()
    bar.fill.fore_color.rgb = ACCENT_RED
    bar.line.fill.background()

    tb1 = slide1.shapes.add_textbox(Inches(0.8), Inches(1.2), Inches(11.7), Inches(3.5))
    tf1 = tb1.text_frame
    tf1.word_wrap = True
    
    p0 = tf1.paragraphs[0]
    p0.text = "AI BUILDER CUP 2026 // TRACK: BFSI RISK & FRAUD"
    p0.font.name = "Consolas"
    p0.font.size = Pt(13)
    p0.font.bold = True
    p0.font.color.rgb = ACCENT_CYAN
    
    p1 = tf1.add_paragraph()
    p1.text = "SHAHEEN // INTERCEPTOR"
    p1.font.name = "Arial Black"
    p1.font.size = Pt(44)
    p1.font.bold = True
    p1.font.color.rgb = TEXT_WHITE
    
    p2 = tf1.add_paragraph()
    p2.text = "Autonomous Pre-Settlement APP-Fraud, Vishing & Money Mule Defense Platform"
    p2.font.name = "Arial"
    p2.font.size = Pt(20)
    p2.font.color.rgb = ACCENT_AMBER
    
    p3 = tf1.add_paragraph()
    p3.text = "Stopping psychological coercion fraud before funds clear the core banking switch."
    p3.font.name = "Arial"
    p3.font.size = Pt(14)
    p3.font.color.rgb = TEXT_SLATE

    # Details Box
    det_box = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(5.2), Inches(11.733), Inches(1.5))
    det_box.fill.solid()
    det_box.fill.fore_color.rgb = PANEL_BG
    det_box.line.color.rgb = RGBColor(40, 50, 70)
    det_tf = det_box.text_frame
    det_tf.word_wrap = True
    
    dp1 = det_tf.paragraphs[0]
    dp1.text = "TEAM: Shaheen  |  TEAM LEAD: Amaan Masood  |  COMPLIANCE: SBP BPRD Circular No. 03 / AMLA 2010"
    dp1.font.name = "Consolas"
    dp1.font.size = Pt(12)
    dp1.font.bold = True
    dp1.font.color.rgb = TEXT_WHITE
    
    dp2 = det_tf.add_paragraph()
    dp2.text = "CORE STACK: Google Gemini 2.5 Flash • FastAPI Docker Microservice • Google Cloud Run • React 19 • Firestore"
    dp2.font.name = "Consolas"
    dp2.font.size = Pt(11)
    dp2.font.color.rgb = ACCENT_CYAN

    # ==========================================
    # SLIDE 2: The Problem
    # ==========================================
    slide2 = prs.slides.add_slide(blank_layout)
    add_bg(slide2)
    add_header(slide2, "The Multi-Billion Dollar Blindspot: Authorized Push Payment Fraud", "THE SYSTEMIC CRISIS")
    
    # 3 Stat Cards
    stats = [
        ("PKR 14.8 BILLION", "Lost annually in Pakistan to Vishing & APP Mule fraud ($12.4B Globally)", ACCENT_RED),
        ("THE VALID OTP BLINDSPOT", "Victim themselves enters legitimate OTP under impersonation coercion", ACCENT_AMBER),
        ("SUB-4 MINUTE CASH-OUT", "Funds layered across 3 mule hops and exited via Binance P2P & ATMs", ACCENT_CYAN)
    ]
    for i, (st, desc, col) in enumerate(stats):
        bx = slide2.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8 + i * 4.0), Inches(1.8), Inches(3.733), Inches(4.8))
        bx.fill.solid()
        bx.fill.fore_color.rgb = PANEL_BG
        bx.line.color.rgb = col
        btf = bx.text_frame
        btf.word_wrap = True
        
        p = btf.paragraphs[0]
        p.text = st
        p.font.name = "Arial Black"
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = col
        
        p_desc = btf.add_paragraph()
        p_desc.text = "\n" + desc
        p_desc.font.name = "Arial"
        p_desc.font.size = Pt(13)
        p_desc.font.color.rgb = TEXT_WHITE

    # ==========================================
    # SLIDE 3: Anatomy of the Attack
    # ==========================================
    slide3 = prs.slides.add_slide(blank_layout)
    add_bg(slide3)
    add_header(slide3, "Anatomy of the 4-Minute Fraud Lifecycle", "THREAT TIMELINE")
    
    steps = [
        ("HOP 0: COERCION", "Scammer spoofs FIA Cyber Crime caller ID. Induces panic under PECA Section 21 threat.", ACCENT_RED),
        ("HOP 1: EXECUTION", "Terrified victim transfers Rs. 450,000 from Meezan/SCB mobile app using genuine biometric OTP.", ACCENT_AMBER),
        ("HOP 2: LAYERING", "Within 90 seconds, funds split into 2 secondary student mule accounts across banks.", ACCENT_CYAN),
        ("HOP 3: LIQUIDATION", "Within 4 minutes, funds exit into Binance P2P USDT escrow or ATM withdrawal in Rawalpindi.", ACCENT_RED)
    ]
    for i, (title, desc, col) in enumerate(steps):
        bx = slide3.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.7 + i * 1.3), Inches(11.733), Inches(1.1))
        bx.fill.solid()
        bx.fill.fore_color.rgb = PANEL_BG
        bx.line.color.rgb = col
        btf = bx.text_frame
        btf.word_wrap = True
        
        p = btf.paragraphs[0]
        p.text = f"[{i+1}]  {title}  —  {desc}"
        p.font.name = "Consolas"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE

    # ==========================================
    # SLIDE 4: Why Existing Systems Fail
    # ==========================================
    slide4 = prs.slides.add_slide(blank_layout)
    add_bg(slide4)
    add_header(slide4, "Why Legacy Banking Systems & Rule Engines Fail", "LEGACY VULNERABILITY VS SHAHEEN")
    
    comp_box = slide4.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.8), Inches(11.733), Inches(5.0))
    comp_box.fill.solid()
    comp_box.fill.fore_color.rgb = PANEL_BG
    comp_box.line.color.rgb = RGBColor(40, 50, 70)
    ctf = comp_box.text_frame
    ctf.word_wrap = True
    
    lines = [
        ("DIMENSION", "LEGACY FRAUD RULE ENGINES", "SHAHEEN INTERCEPTOR (MULTI-AGENT)"),
        ("Timing", "Post-Settlement & Reactive (Hours/Days later)", "Pre-Settlement & Inline (<850ms SLA)"),
        ("Trigger Basis", "Credentials only (If OTP valid, payment approved)", "Conversational Coercion + 3-Hop Graph Topology"),
        ("False Positive Rate", "High (5% - 8% / 44.4% in tests) blocks genuine bills", "Low (5.6% FPR / 0% on Whitelisted Institutions)"),
        ("Syndicate Response", "Passive blacklisting (Scammer moves to next mule)", "Active AI Decoy Honeypot baits secondary IBANs"),
        ("Compliance", "Manual 3-7 day drafting of SAR regulatory forms", "Automated SBP FMU SAR Report generated in <3 sec")
    ]
    for idx, (dim, leg, shn) in enumerate(lines):
        p = ctf.paragraphs[0] if idx == 0 else ctf.add_paragraph()
        if idx == 0:
            p.text = f"{dim:<22} | {leg:<42} | {shn}"
            p.font.bold = True
            p.font.color.rgb = ACCENT_CYAN
        else:
            p.text = f"{dim:<22} | {leg:<42} | {shn}"
            p.font.color.rgb = TEXT_WHITE if idx % 2 == 1 else TEXT_SLATE
        p.font.name = "Consolas"
        p.font.size = Pt(12)

    # ==========================================
    # SLIDE 5: The Solution
    # ==========================================
    slide5 = prs.slides.add_slide(blank_layout)
    add_bg(slide5)
    add_header(slide5, "Shaheen Interceptor: The Pre-Settlement Defense Platform", "SOLUTION ARCHITECTURE")
    
    pillars = [
        ("MULTIMODAL COERCION RADAR", "Scans live audio & transcripts for impersonation keywords, emotional agitation, and police threats.", ACCENT_RED),
        ("3-HOP MULE TOPOLOGY HUNTER", "Evaluates destination account age, velocity structuring (<Rs. 50k), and device fingerprint clusters.", ACCENT_AMBER),
        ("AUTONOMOUS DECOY HONEYPOT", "Feigns confusion as 'Haji Saleem' to extract secondary backup IBANs and phone numbers live.", ACCENT_CYAN),
        ("SBP 1-CLICK SAR COMPLIANCE", "Generates legally binding Suspicious Activity Reports (AMLA 2010 Section 7) with SHA-256 seal.", ACCENT_GREEN)
    ]
    for i, (pt, pdesc, pcol) in enumerate(pillars):
        bx = slide5.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8 + (i % 2) * 6.0), Inches(1.8 + (i // 2) * 2.5), Inches(5.733), Inches(2.2))
        bx.fill.solid()
        bx.fill.fore_color.rgb = PANEL_BG
        bx.line.color.rgb = pcol
        btf = bx.text_frame
        btf.word_wrap = True
        
        p = btf.paragraphs[0]
        p.text = pt
        p.font.name = "Arial Black"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = pcol
        
        pd = btf.add_paragraph()
        pd.text = "\n" + pdesc
        pd.font.name = "Arial"
        pd.font.size = Pt(12)
        pd.font.color.rgb = TEXT_WHITE

    # ==========================================
    # SLIDE 6: Multi-Agent Deep Dive
    # ==========================================
    slide6 = prs.slides.add_slide(blank_layout)
    add_bg(slide6)
    add_header(slide6, "Parallel Multi-Agent Architecture (Google Gemini 2.5 Flash)", "ENGINEERING RIGOR")
    
    agents = [
        ("AGENT 1: COERCION RADAR", "Model: Gemini 2.5 Flash\nTask: Analyzes linguistic coercion, arrest intimidation under PECA 2016, and urgency spikes.\nOutput: Coercion Risk Score (0-100) + Quoted Evidence.", ACCENT_RED),
        ("AGENT 2: MULE GRAPH HUNTER", "Engine: Graph Analytics + Firestore\nTask: Evaluates beneficiary account age (4 days), rapid fan-out layering, and shared device hashes.\nOutput: Mule Risk Score (0-100) + Cluster Topology.", ACCENT_AMBER),
        ("AGENT 3: COUNTER-INTEL HONEYPOT", "Engine: Autonomous Persona Agent\nTask: Plays 'Haji Saleem' feigning error E-409 to bait scammer into sending secondary IBANs.\nOutput: Harvested IOCs + Regulatory SBP FMU Dossier.", ACCENT_CYAN)
    ]
    for i, (at, adesc, acol) in enumerate(agents):
        bx = slide6.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8 + i * 4.0), Inches(1.8), Inches(3.733), Inches(4.8))
        bx.fill.solid()
        bx.fill.fore_color.rgb = PANEL_BG
        bx.line.color.rgb = acol
        btf = bx.text_frame
        btf.word_wrap = True
        
        p = btf.paragraphs[0]
        p.text = at
        p.font.name = "Arial Black"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = acol
        
        pd = btf.add_paragraph()
        pd.text = "\n" + adesc
        pd.font.name = "Consolas"
        pd.font.size = Pt(11)
        pd.font.color.rgb = TEXT_WHITE

    # ==========================================
    # SLIDE 7: Live SOC Command Center (UI Walkthrough)
    # ==========================================
    slide7 = prs.slides.add_slide(blank_layout)
    add_bg(slide7)
    add_header(slide7, "Shaheen SOC Mission Control: Cockpit Overview", "LIVE PROTOTYPE")
    
    img_overview = os.path.join(assets_dir, "screenshot_overview.jpeg")
    if os.path.exists(img_overview):
        slide7.shapes.add_picture(img_overview, Inches(0.8), Inches(1.8), Inches(11.733), Inches(5.0))
    else:
        # Fallback text box
        bx = slide7.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.8), Inches(11.733), Inches(5.0))
        bx.fill.solid()
        bx.fill.fore_color.rgb = PANEL_BG

    # ==========================================
    # SLIDE 8: The 3 Operational Scenarios
    # ==========================================
    slide8 = prs.slides.add_slide(blank_layout)
    add_bg(slide8)
    add_header(slide8, "Live Operational Scenarios Demonstrated", "TRIAGE TEST CASES")
    
    scenarios = [
        ("CASE-01 // FIA_EXTORTION", "Amount: Rs. 450,000\nVictim: Haji Saleem (68 yrs)\nThreat: Fake FIA Inspector Arrest Threat\nVerdict: 97% Risk -> QUARANTINED in 680ms.", ACCENT_RED),
        ("CASE-02 // MULE_RING", "Amount: Rs. 270,000\nVictim: Student Digital Account\nThreat: 6 rapid micro-transfers under Rs. 50k\nVerdict: 84% Risk -> STEP-UP AUTH / QUARANTINE.", ACCENT_AMBER),
        ("CASE-03 // CLEAN_HOSPITAL", "Amount: Rs. 380,000\nVictim: Farhan Siddiqui\nTransfer: Shaukat Khanum Cancer Hospital\nVerdict: 4% Risk -> CLEARED (3 SEC, 0% FPR).", ACCENT_GREEN)
    ]
    for i, (sct, scdesc, sccol) in enumerate(scenarios):
        bx = slide8.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8 + i * 4.0), Inches(1.8), Inches(3.733), Inches(4.8))
        bx.fill.solid()
        bx.fill.fore_color.rgb = PANEL_BG
        bx.line.color.rgb = sccol
        btf = bx.text_frame
        btf.word_wrap = True
        
        p = btf.paragraphs[0]
        p.text = sct
        p.font.name = "Arial Black"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = sccol
        
        pd = btf.add_paragraph()
        pd.text = "\n" + scdesc
        pd.font.name = "Consolas"
        pd.font.size = Pt(12)
        pd.font.color.rgb = TEXT_WHITE

    # ==========================================
    # SLIDE 9: 3-Hop Mule Network Graph
    # ==========================================
    slide9 = prs.slides.add_slide(blank_layout)
    add_bg(slide9)
    add_header(slide9, "3-Hop Mule Network Radar: Pre-Settlement Interlock", "MONEY TRAIL GRAPH")
    
    img_graph = os.path.join(assets_dir, "screenshot_network_graph.png")
    if os.path.exists(img_graph):
        slide9.shapes.add_picture(img_graph, Inches(0.8), Inches(1.8), Inches(11.733), Inches(5.0))

    # ==========================================
    # SLIDE 10: Counter-Intelligence Decoy Honeypot
    # ==========================================
    slide10 = prs.slides.add_slide(blank_layout)
    add_bg(slide10)
    add_header(slide10, "Autonomous Counter-Intelligence Decoy Honeypot", "OFFENSIVE INTELLIGENCE")
    
    img_decoy = os.path.join(assets_dir, "screenshot_decoy_honeypot.png")
    if os.path.exists(img_decoy):
        slide10.shapes.add_picture(img_decoy, Inches(0.8), Inches(1.8), Inches(11.733), Inches(5.0))

    # ==========================================
    # SLIDE 11: Regulatory SAR Compliance
    # ==========================================
    slide11 = prs.slides.add_slide(blank_layout)
    add_bg(slide11)
    add_header(slide11, "Regulatory Compliance & 1-Click SBP SAR / STR Export", "LEGAL SANCTIONS COMPLIANCE")
    
    img_sar = os.path.join(assets_dir, "screenshot_sar_modal.png")
    if os.path.exists(img_sar):
        slide11.shapes.add_picture(img_sar, Inches(0.8), Inches(1.8), Inches(11.733), Inches(5.0))

    # ==========================================
    # SLIDE 12: Empirical Performance Benchmark (Slide 12 Requirement)
    # ==========================================
    slide12 = prs.slides.add_slide(blank_layout)
    add_bg(slide12)
    add_header(slide12, "Empirical Evaluation Protocol: 40-Case Held-Out Benchmark", "SLIDE 12 // EMPIRICAL BENCHMARK")
    
    img_bm = os.path.join(assets_dir, "screenshot_benchmark_slide12.png")
    if os.path.exists(img_bm):
        slide12.shapes.add_picture(img_bm, Inches(0.8), Inches(1.8), Inches(11.733), Inches(5.0))

    # ==========================================
    # SLIDE 13: Bank Integration Architecture
    # ==========================================
    slide13 = prs.slides.add_slide(blank_layout)
    add_bg(slide13)
    add_header(slide13, "Bank Integration Model: Inline Pre-Submit REST API", "REAL-WORLD DEPLOYMENT")
    
    int_box = slide13.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.8), Inches(11.733), Inches(5.0))
    int_box.fill.solid()
    int_box.fill.fore_color.rgb = PANEL_BG
    int_box.line.color.rgb = ACCENT_CYAN
    itf = int_box.text_frame
    itf.word_wrap = True
    
    int_text = [
        "1. THE INTEGRATION PATTERN: Bank-side REST API (Deployable Today)",
        "   - Shaheen runs as a microservice called by the bank's mobile app backend during PRE-SUBMIT.",
        "   - Called BEFORE transaction message hits 1Link or Raast core clearing switches.",
        "   - Single endpoint: POST /v1/assess (JSON in, JSON out, <850ms decision budget).",
        "",
        "2. ZERO CUSTOMER-FACING FRICTION:",
        "   - Clean payments pass in 3 seconds with zero interruption.",
        "   - High-coercion payments trigger step-up biometric auth or 15-minute protective escrow.",
        "",
        "3. REGULATORY ALIGNMENT:",
        "   - State Bank of Pakistan (SBP) BPRD Circular No. 03 of 2023.",
        "   - Anti-Money Laundering Act 2010 (AMLA) Section 7 statutory reporting automation."
    ]
    for idx, line in enumerate(int_text):
        p = itf.paragraphs[0] if idx == 0 else itf.add_paragraph()
        p.text = line
        p.font.name = "Consolas"
        p.font.size = Pt(13)
        p.font.bold = True if idx in [0, 4, 8] else False
        p.font.color.rgb = ACCENT_AMBER if idx in [0, 4, 8] else TEXT_WHITE

    # ==========================================
    # SLIDE 14: Submission Summary & Links
    # ==========================================
    slide14 = prs.slides.add_slide(blank_layout)
    add_bg(slide14)
    add_header(slide14, "Submission Deliverables & Team Summary", "HACK2SKILL FINAL SUBMISSION")
    
    fin_box = slide14.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.8), Inches(11.733), Inches(5.0))
    fin_box.fill.solid()
    fin_box.fill.fore_color.rgb = PANEL_BG
    fin_box.line.color.rgb = ACCENT_GREEN
    ftf = fin_box.text_frame
    ftf.word_wrap = True
    
    fin_text = [
        "CHALLENGE TRACK: BFSI: Intelligent Risk, Fraud & Financial Experiences",
        "",
        "GITHUB REPOSITORY (PUBLIC):",
        "https://github.com/Amaan-Masood/shaheen-interceptor",
        "",
        "DEPLOYED PROTOTYPE ON GCP / CLOUD RUN:",
        "https://shaheen-interceptor.vercel.app  (Also deployed via Firebase / Cloud Run)",
        "",
        "BENCHMARK DIGEST & AUDIT TRAIL:",
        "40 Frozen Test Cases | SHA-256: 9d650f03754dc84f02c637c4dfb3a4e698a497d175d6241a7328dc2ff545cb55",
        "",
        "TEAM SHAHEEN: Amaan Masood (Lead Architect & Developer)",
        "Empowering Pakistan's financial ecosystem with autonomous cyber defense."
    ]
    for idx, line in enumerate(fin_text):
        p = ftf.paragraphs[0] if idx == 0 else ftf.add_paragraph()
        p.text = line
        p.font.name = "Consolas"
        p.font.size = Pt(12)
        p.font.bold = True if "CHALLENGE" in line or "GITHUB" in line or "DEPLOYED" in line or "TEAM" in line else False
        p.font.color.rgb = ACCENT_CYAN if "https://" in line else (ACCENT_AMBER if "CHALLENGE" in line else TEXT_WHITE)

    # Save PPTX
    output_pptx = os.path.join(os.path.dirname(__file__), "SHAHEEN_INTERCEPTOR_PITCH_DECK.pptx")
    prs.save(output_pptx)
    print(f"Presentation successfully created at: {output_pptx}")

if __name__ == "__main__":
    create_deck()
