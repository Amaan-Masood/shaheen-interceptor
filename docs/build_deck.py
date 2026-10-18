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

    # Executive Tactical Color Palette
    BG_COLOR     = RGBColor(7, 10, 15)       # Void Obsidian #070A0F
    PANEL_BG     = RGBColor(13, 18, 29)      # Panel #0D121D
    CARD_BG      = RGBColor(16, 23, 38)      # Card #101726
    BORDER_DIM   = RGBColor(30, 41, 59)      # Border #1E293B
    BORDER_CYAN  = RGBColor(0, 180, 216)     # Cyan border
    TEXT_WHITE   = RGBColor(248, 250, 252)   # #F8FAFC
    TEXT_SLATE   = RGBColor(148, 163, 184)   # #94A3B8
    TEXT_MUTED   = RGBColor(100, 116, 139)   # #64748B
    ACCENT_RED   = RGBColor(244, 63, 94)     # Crimson #F43F5E
    ACCENT_CYAN  = RGBColor(0, 240, 255)    # Cyan #00F0FF
    ACCENT_GREEN = RGBColor(16, 185, 129)    # Emerald #10B981
    ACCENT_AMBER = RGBColor(245, 158, 11)    # Amber #F59E0B

    def add_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_COLOR
        bg.line.fill.background()
        return bg

    def add_header(slide, title_text, category_text="BFSI DEFENSE // MISSION CONTROL"):
        # Category / Pill
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.35), Inches(11.733), Inches(0.35))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        tf_cat.margin_left = tf_cat.margin_top = tf_cat.margin_right = tf_cat.margin_bottom = 0
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = f"[ {category_text.upper()} ]"
        p_cat.font.name = "Consolas"
        p_cat.font.size = Pt(10)
        p_cat.font.bold = True
        p_cat.font.color.rgb = ACCENT_CYAN
        
        # Title
        t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.65), Inches(11.733), Inches(0.6))
        tf_t = t_box.text_frame
        tf_t.word_wrap = True
        tf_t.margin_left = tf_t.margin_top = tf_t.margin_right = tf_t.margin_bottom = 0
        p_title = tf_t.paragraphs[0]
        p_title.text = title_text
        p_title.font.name = "Arial"
        p_title.font.size = Pt(22)
        p_title.font.bold = True
        p_title.font.color.rgb = TEXT_WHITE

        # Divider line
        div = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.3), Inches(11.733), Inches(0.02))
        div.fill.solid()
        div.fill.fore_color.rgb = BORDER_DIM
        div.line.fill.background()

    def add_browser_mockup(slide, img_path, left, top, width, height, title="SOC MISSION CONTROL // LIVE INTERCEPT RADAR"):
        # Header bar of browser
        hdr_h = Inches(0.35)
        hdr = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, width, hdr_h)
        hdr.fill.solid()
        hdr.fill.fore_color.rgb = RGBColor(20, 27, 45)
        hdr.line.color.rgb = BORDER_DIM
        
        htf = hdr.text_frame
        htf.margin_left = Inches(0.15)
        htf.margin_top = Inches(0.06)
        hp = htf.paragraphs[0]
        hp.text = f"● ● ●   https://shaheen.interceptor.gov.pk // {title}"
        hp.font.name = "Consolas"
        hp.font.size = Pt(9.5)
        hp.font.color.rgb = TEXT_SLATE

        # Image
        if os.path.exists(img_path):
            slide.shapes.add_picture(img_path, left, top + hdr_h, width, height - hdr_h)
        else:
            fb = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top + hdr_h, width, height - hdr_h)
            fb.fill.solid()
            fb.fill.fore_color.rgb = PANEL_BG

    assets_dir = os.path.join(os.path.dirname(__file__), "slides_assets")

    # =========================================================================
    # SLIDE 1: Cover (Featuring Both Amaan Masood & Asifa Abbas)
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_layout)
    add_bg(slide1)
    
    # Red accent stripe
    bar = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.7), Inches(1.8), Inches(0.06))
    bar.fill.solid()
    bar.fill.fore_color.rgb = ACCENT_RED
    bar.line.fill.background()

    tb1 = slide1.shapes.add_textbox(Inches(0.8), Inches(0.9), Inches(11.733), Inches(3.6))
    tf1 = tb1.text_frame
    tf1.word_wrap = True
    
    p0 = tf1.paragraphs[0]
    p0.text = "AI BUILDER CUP 2026 // BFSI: INTELLIGENT RISK, FRAUD & FINANCIAL EXPERIENCES"
    p0.font.name = "Consolas"
    p0.font.size = Pt(11)
    p0.font.bold = True
    p0.font.color.rgb = ACCENT_CYAN
    
    p1 = tf1.add_paragraph()
    p1.text = "SHAHEEN // INTERCEPTOR"
    p1.font.name = "Arial Black"
    p1.font.size = Pt(40)
    p1.font.bold = True
    p1.font.color.rgb = TEXT_WHITE
    
    p2 = tf1.add_paragraph()
    p2.text = "Autonomous Pre-Settlement APP-Fraud, Vishing & Money Mule Defense Platform"
    p2.font.name = "Arial"
    p2.font.size = Pt(18)
    p2.font.bold = True
    p2.font.color.rgb = ACCENT_AMBER
    
    p3 = tf1.add_paragraph()
    p3.text = "Stopping psychological coercion fraud before funds clear the core banking switch (SBP Raast / 1Link)."
    p3.font.name = "Arial"
    p3.font.size = Pt(13)
    p3.font.color.rgb = TEXT_SLATE

    # Team Members Dual Profile Cards
    t_box1 = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.7), Inches(5.7), Inches(2.2))
    t_box1.fill.solid()
    t_box1.fill.fore_color.rgb = PANEL_BG
    t_box1.line.color.rgb = ACCENT_CYAN
    ttf1 = t_box1.text_frame
    ttf1.margin_left = ttf1.margin_right = Inches(0.3)
    ttf1.margin_top = Inches(0.25)
    ttf1.word_wrap = True
    
    tp1 = ttf1.paragraphs[0]
    tp1.text = "TEAM LEADER // LEAD SYSTEMS ARCHITECT"
    tp1.font.name = "Consolas"
    tp1.font.size = Pt(10)
    tp1.font.bold = True
    tp1.font.color.rgb = ACCENT_CYAN
    
    tp2 = ttf1.add_paragraph()
    tp2.text = "Amaan Masood"
    tp2.font.name = "Arial Black"
    tp2.font.size = Pt(18)
    tp2.font.color.rgb = TEXT_WHITE
    
    tp3 = ttf1.add_paragraph()
    tp3.text = "Email: amaanmasood69@gmail.com\nRole: Core Multi-Agent Architecture, SBP Interlock Engine & Full-Stack"
    tp3.font.name = "Consolas"
    tp3.font.size = Pt(10)
    tp3.font.color.rgb = TEXT_SLATE

    t_box2 = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.833), Inches(4.7), Inches(5.7), Inches(2.2))
    t_box2.fill.solid()
    t_box2.fill.fore_color.rgb = PANEL_BG
    t_box2.line.color.rgb = ACCENT_AMBER
    ttf2 = t_box2.text_frame
    ttf2.margin_left = ttf2.margin_right = Inches(0.3)
    ttf2.margin_top = Inches(0.25)
    ttf2.word_wrap = True
    
    tp4 = ttf2.paragraphs[0]
    tp4.text = "TEAM MEMBER // FINTECH & COMPLIANCE"
    tp4.font.name = "Consolas"
    tp4.font.size = Pt(10)
    tp4.font.bold = True
    tp4.font.color.rgb = ACCENT_AMBER
    
    tp5 = ttf2.add_paragraph()
    tp5.text = "Asifa Abbas"
    tp5.font.name = "Arial Black"
    tp5.font.size = Pt(18)
    tp5.font.color.rgb = TEXT_WHITE
    
    tp6 = ttf2.add_paragraph()
    tp6.text = "Email: asifaabbas007@gmail.com\nRole: SBP Circular 03 / AMLA Compliance, Threat Modeling & Dataset Verification"
    tp6.font.name = "Consolas"
    tp6.font.size = Pt(10)
    tp6.font.color.rgb = TEXT_SLATE

    # =========================================================================
    # SLIDE 2: The Problem
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_layout)
    add_bg(slide2)
    add_header(slide2, "The Multi-Billion Dollar Blindspot: Authorized Push Payment Fraud", "THE SYSTEMIC CRISIS")
    
    stats = [
        ("PKR 14.8 BILLION", "Lost annually in Pakistan to Vishing & APP Mule fraud ($12.4B Globally)", ACCENT_RED, [
            "• Massive surge in government impersonation (FIA, SBP, Police, PTA).",
            "• Average victim loss: Rs. 420,000+ per vishing incident.",
            "• 94% of funds exit banking rails within 4 minutes."
        ]),
        ("THE VALID OTP BLINDSPOT", "Core banking authentication succeeds, but transaction is fraudulent", ACCENT_AMBER, [
            "• Victims are coerced into entering their genuine SMS OTP and biometric checks.",
            "• To 1Link / Raast switches, the transfer appears 100% legitimate.",
            "• Traditional rule engines fail because credentials are valid."
        ]),
        ("< 4-MINUTE OFF-RAMP", "Mule networks layer and liquidate funds before bank support responds", ACCENT_CYAN, [
            "• Funds fan-out into 3 hops of student/mule digital accounts.",
            "• Final cash-out via Binance P2P crypto escrow (USDT) or ATMs.",
            "• Irreversible by the time victim calls helpline."
        ])
    ]
    for i, (st, desc, col, bullets) in enumerate(stats):
        bx = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + i * 4.0), Inches(1.6), Inches(3.733), Inches(5.3))
        bx.fill.solid()
        bx.fill.fore_color.rgb = PANEL_BG
        bx.line.color.rgb = col
        btf = bx.text_frame
        btf.margin_left = btf.margin_right = Inches(0.25)
        btf.margin_top = Inches(0.3)
        btf.word_wrap = True
        
        p = btf.paragraphs[0]
        p.text = st
        p.font.name = "Arial Black"
        p.font.size = Pt(16)
        p.font.color.rgb = col
        
        pd = btf.add_paragraph()
        pd.text = desc + "\n"
        pd.font.name = "Arial"
        pd.font.size = Pt(11)
        pd.font.bold = True
        pd.font.color.rgb = TEXT_WHITE
        
        for b in bullets:
            pb = btf.add_paragraph()
            pb.text = b
            pb.font.name = "Consolas"
            pb.font.size = Pt(10)
            pb.font.color.rgb = TEXT_SLATE

    # =========================================================================
    # SLIDE 3: Anatomy of the Attack
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_layout)
    add_bg(slide3)
    add_header(slide3, "Anatomy of the 4-Minute Fraud Lifecycle", "THREAT TIMELINE")
    
    lifecycle = [
        ("HOP 0: COERCION STRIKE", "Scammer spoofs FIA Cyber Crime ID. Urgently threatens imminent door-break police raid under PECA Section 21.", ACCENT_RED, "00:00 - 01:15"),
        ("HOP 1: VICTIM TRANSFER", "Terrified senior citizen transfers Rs. 450,000 from Meezan/SCB mobile app using valid biometric OTP.", ACCENT_AMBER, "01:15 - 01:45"),
        ("HOP 2: MULE FAN-OUT", "Funds immediately fan-out across 2 secondary student mule accounts in <90 seconds to evade AML thresholds.", ACCENT_CYAN, "01:45 - 02:45"),
        ("HOP 3: CRYPTO OFF-RAMP", "Laundered funds exit into Binance P2P escrow (USDT) or physical ATM cash-out in Rawalpindi.", ACCENT_RED, "02:45 - 04:00")
    ]
    for i, (title, desc, col, time_stamp) in enumerate(lifecycle):
        bx = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.6 + i * 1.35), Inches(11.733), Inches(1.15))
        bx.fill.solid()
        bx.fill.fore_color.rgb = PANEL_BG
        bx.line.color.rgb = col
        btf = bx.text_frame
        btf.margin_left = Inches(0.3)
        btf.margin_top = Inches(0.2)
        btf.word_wrap = True
        
        p = btf.paragraphs[0]
        p.text = f"{time_stamp}  |  {title}"
        p.font.name = "Consolas"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = col
        
        pd = btf.add_paragraph()
        pd.text = desc
        pd.font.name = "Arial"
        pd.font.size = Pt(11)
        pd.font.color.rgb = TEXT_WHITE

    # =========================================================================
    # SLIDE 4: Why Legacy Systems Fail
    # =========================================================================
    slide4 = prs.slides.add_slide(blank_layout)
    add_bg(slide4)
    add_header(slide4, "Legacy Banking Rule Engines vs Shaheen Interceptor", "COMPARATIVE AUDIT")
    
    comp_box = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.6), Inches(11.733), Inches(5.3))
    comp_box.fill.solid()
    comp_box.fill.fore_color.rgb = PANEL_BG
    comp_box.line.color.rgb = BORDER_DIM
    ctf = comp_box.text_frame
    ctf.margin_left = ctf.margin_right = Inches(0.3)
    ctf.margin_top = Inches(0.3)
    ctf.word_wrap = True
    
    comparisons = [
        ("EVALUATION DIMENSION", "LEGACY RULE ENGINES (FICO / SAS)", "SHAHEEN INTERCEPTOR (MULTI-AGENT)", ACCENT_CYAN),
        ("Execution Timing", "Post-Settlement: Alerts trigger hours after money has left.", "Pre-Settlement: Interlocks funds inline in <850ms SLA.", TEXT_WHITE),
        ("Detection Vector", "Credentials only: Valid OTP = 100% Approved.", "Psychological Coercion + 3-Hop Mule Topology.", TEXT_WHITE),
        ("False Positive Rate", "High (5% - 8% / 44.4% in tests) blocks genuine bills.", "Low: 5.6% FPR (0.0% on Whitelisted Institutions).", ACCENT_GREEN),
        ("Syndicate Response", "Passive blacklisting: Scammer simply switches mules.", "Active AI Decoy: Baits & neutralizes backup accounts.", ACCENT_AMBER),
        ("Regulatory Compliance", "Manual 3-7 day drafting of SBP SAR / STR reports.", "1-Click automated SBP FMU filing with SHA-256 seal.", ACCENT_CYAN)
    ]
    for idx, (dim, leg, shn, col) in enumerate(comparisons):
        p = ctf.paragraphs[0] if idx == 0 else ctf.add_paragraph()
        p.text = f"{dim:<22}  |  {leg:<44}  |  {shn}"
        p.font.name = "Consolas"
        p.font.size = Pt(11.5)
        p.font.bold = True if idx == 0 else False
        p.font.color.rgb = col

    # =========================================================================
    # SLIDE 5: The Solution
    # =========================================================================
    slide5 = prs.slides.add_slide(blank_layout)
    add_bg(slide5)
    add_header(slide5, "Shaheen Interceptor: Pre-Settlement Defense Platform", "SOLUTION OVERVIEW")
    
    pillars = [
        ("1. MULTIMODAL COERCION RADAR", "Scans live audio & transcripts for police threats, emotional agitation, and urgency markers using Gemini 2.5 Flash.", ACCENT_RED),
        ("2. 3-HOP MULE TOPOLOGY HUNTER", "Evaluates destination account age (4 days), rapid structuring (<Rs. 50k), and device fingerprint clusters.", ACCENT_AMBER),
        ("3. AUTONOMOUS DECOY HONEYPOT", "Feigns confusion as 'Haji Saleem' reporting Error E-409 to bait the scammer into revealing secondary backup IBANs.", ACCENT_CYAN),
        ("4. SBP FMU 1-CLICK SAR FILING", "Compiles legally binding Suspicious Activity Reports (AMLA 2010 Section 7) with real cryptographic SHA-256 seal.", ACCENT_GREEN)
    ]
    for i, (pt, pdesc, pcol) in enumerate(pillars):
        bx = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + (i % 2) * 6.0), Inches(1.6 + (i // 2) * 2.65), Inches(5.733), Inches(2.4))
        bx.fill.solid()
        bx.fill.fore_color.rgb = PANEL_BG
        bx.line.color.rgb = pcol
        btf = bx.text_frame
        btf.margin_left = btf.margin_right = Inches(0.3)
        btf.margin_top = Inches(0.3)
        btf.word_wrap = True
        
        p = btf.paragraphs[0]
        p.text = pt
        p.font.name = "Arial Black"
        p.font.size = Pt(14)
        p.font.color.rgb = pcol
        
        pd = btf.add_paragraph()
        pd.text = "\n" + pdesc
        pd.font.name = "Arial"
        pd.font.size = Pt(12)
        pd.font.color.rgb = TEXT_WHITE

    # =========================================================================
    # SLIDE 6: Multi-Agent Parallel Architecture
    # =========================================================================
    slide6 = prs.slides.add_slide(blank_layout)
    add_bg(slide6)
    add_header(slide6, "Parallel Multi-Agent Architecture (Google Gemini 2.5 Flash)", "ENGINEERING RIGOR")
    
    agent_cards = [
        ("AGENT 1: COERCION RADAR", "ENGINE: Gemini 2.5 Flash\nLATENCY: 680 ms\nINPUT: Live Call Transcript / Audio\n\n• Linguistic urgency analysis.\n• Detection of law enforcement impersonation (FIA / Police).\n• Structured output with verbatim trigger quote highlights.\n• Prompt-injection defense floor.", ACCENT_RED),
        ("AGENT 2: MULE HUNTER", "ENGINE: Graph Store + Python\nLATENCY: 42 ms\nINPUT: 3-Hop Account Topology\n\n• Beneficiary account age audit (4 days old).\n• Fan-in / Fan-out velocity scoring.\n• Cross-bank device fingerprint clustering (`DEV-MULE-8812`).\n• Identifies Binance P2P off-ramps.", ACCENT_AMBER),
        ("AGENT 3: DECOY & SAR", "ENGINE: Autonomous Persona + FMU\nLATENCY: <3 sec (Filing)\nINPUT: Quarantined Incident Feed\n\n• Plays 'Haji Saleem' feigning error.\n• Baits backup IBANs / Raast IDs.\n• Auto-submits IOCs to SBP blocklist.\n• Compiles statutory SAR dossier with SHA-256 cryptographic seal.", ACCENT_CYAN)
    ]
    for i, (at, adesc, acol) in enumerate(agent_cards):
        bx = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + i * 4.0), Inches(1.6), Inches(3.733), Inches(5.3))
        bx.fill.solid()
        bx.fill.fore_color.rgb = PANEL_BG
        bx.line.color.rgb = acol
        btf = bx.text_frame
        btf.margin_left = btf.margin_right = Inches(0.25)
        btf.margin_top = Inches(0.3)
        btf.word_wrap = True
        
        p = btf.paragraphs[0]
        p.text = at
        p.font.name = "Arial Black"
        p.font.size = Pt(14)
        p.font.color.rgb = acol
        
        pd = btf.add_paragraph()
        pd.text = "\n" + adesc
        pd.font.name = "Consolas"
        pd.font.size = Pt(10.5)
        pd.font.color.rgb = TEXT_WHITE

    # =========================================================================
    # SLIDE 7: Live SOC Command Center (UI Walkthrough)
    # =========================================================================
    slide7 = prs.slides.add_slide(blank_layout)
    add_bg(slide7)
    add_header(slide7, "Shaheen SOC Mission Control: Cockpit Overview", "LIVE PROTOTYPE")
    
    img_overview = os.path.join(assets_dir, "screenshot_overview.jpeg")
    add_browser_mockup(slide7, img_overview, Inches(0.8), Inches(1.6), Inches(11.733), Inches(5.3), "SOC MISSION CONTROL DASHBOARD")

    # =========================================================================
    # SLIDE 8: The 3 Operational Scenarios
    # =========================================================================
    slide8 = prs.slides.add_slide(blank_layout)
    add_bg(slide8)
    add_header(slide8, "Live Operational Scenarios Demonstrated", "TRIAGE TEST CASES")
    
    scenarios = [
        ("CASE-01 // FIA_EXTORTION", "AMOUNT: Rs. 450,000\nVICTIM: Haji Saleem (68 yrs)\n\nTHREAT PROFILE:\n• Caller posed as Inspector Tariq (FIA Cyber Crime Wing).\n• Urgently coerced deposit under PECA arrest warrant.\n\nAI VERDICT:\n• 97% Risk Score\n• PRE-SETTLEMENT INTERLOCK ACTIVE\n• Funds Quarantined in 680ms.", ACCENT_RED),
        ("CASE-02 // MULE_RING", "AMOUNT: Rs. 270,000\nVICTIM: Student Digital Account\n\nTHREAT PROFILE:\n• 6 rapid micro-transfers under Rs. 50k threshold within 10 minutes.\n• Shared Android emulator device ID.\n\nAI VERDICT:\n• 84% Risk Score\n• STEP-UP AUTH / ESCROW HOLD\n• Trapped in 720ms.", ACCENT_AMBER),
        ("CASE-03 // CLEAN_HOSPITAL", "AMOUNT: Rs. 380,000\nRECIPIENT: Shaukat Khanum Hospital\n\nTRANSACTION PROFILE:\n• Genuine ICU bypass surgery advance payment.\n• Verified corporate Askari Bank account.\n\nAI VERDICT:\n• 4% Risk Score\n• 0% False Positive Friction\n• SETTLEMENT CLEARED IN 3 SEC.", ACCENT_GREEN)
    ]
    for i, (sct, scdesc, sccol) in enumerate(scenarios):
        bx = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + i * 4.0), Inches(1.6), Inches(3.733), Inches(5.3))
        bx.fill.solid()
        bx.fill.fore_color.rgb = PANEL_BG
        bx.line.color.rgb = sccol
        btf = bx.text_frame
        btf.margin_left = btf.margin_right = Inches(0.25)
        btf.margin_top = Inches(0.3)
        btf.word_wrap = True
        
        p = btf.paragraphs[0]
        p.text = sct
        p.font.name = "Arial Black"
        p.font.size = Pt(13)
        p.font.color.rgb = sccol
        
        pd = btf.add_paragraph()
        pd.text = "\n" + scdesc
        pd.font.name = "Consolas"
        pd.font.size = Pt(10.5)
        pd.font.color.rgb = TEXT_WHITE

    # =========================================================================
    # SLIDE 9: 3-Hop Mule Network Graph
    # =========================================================================
    slide9 = prs.slides.add_slide(blank_layout)
    add_bg(slide9)
    add_header(slide9, "3-Hop Mule Network Radar: Pre-Settlement Interlock", "MONEY TRAIL GRAPH")
    
    img_graph = os.path.join(assets_dir, "screenshot_network_graph.png")
    add_browser_mockup(slide9, img_graph, Inches(0.8), Inches(1.6), Inches(11.733), Inches(5.3), "3-HOP MULE NETWORK RADAR")

    # =========================================================================
    # SLIDE 10: Counter-Intelligence Decoy Honeypot
    # =========================================================================
    slide10 = prs.slides.add_slide(blank_layout)
    add_bg(slide10)
    add_header(slide10, "Autonomous Counter-Intelligence Decoy Honeypot", "OFFENSIVE INTELLIGENCE")
    
    img_decoy = os.path.join(assets_dir, "screenshot_decoy_honeypot.png")
    add_browser_mockup(slide10, img_decoy, Inches(0.8), Inches(1.6), Inches(11.733), Inches(5.3), "ACTIVE AI DECOY HONEYPOT // HAJI SALEEM")

    # =========================================================================
    # SLIDE 11: Regulatory SAR Compliance
    # =========================================================================
    slide11 = prs.slides.add_slide(blank_layout)
    add_bg(slide11)
    add_header(slide11, "Regulatory Compliance & 1-Click SBP SAR / STR Export", "LEGAL SANCTIONS COMPLIANCE")
    
    img_sar = os.path.join(assets_dir, "screenshot_sar_modal.png")
    add_browser_mockup(slide11, img_sar, Inches(0.8), Inches(1.6), Inches(11.733), Inches(5.3), "STATE BANK OF PAKISTAN (SBP FMU) REGULATORY SAR")

    # =========================================================================
    # SLIDE 12: Empirical Performance Benchmark (Slide 12 Requirement)
    # =========================================================================
    slide12 = prs.slides.add_slide(blank_layout)
    add_bg(slide12)
    add_header(slide12, "Empirical Evaluation Protocol: 40-Case Held-Out Benchmark", "SLIDE 12 // EMPIRICAL BENCHMARK PROOF")
    
    img_bm = os.path.join(assets_dir, "screenshot_benchmark_slide12.png")
    add_browser_mockup(slide12, img_bm, Inches(0.8), Inches(1.6), Inches(11.733), Inches(5.3), "FROZEN 40-CASE HELD-OUT PROTOCOL // SHA-256 DIGEST")

    # =========================================================================
    # SLIDE 13: Bank Integration Architecture
    # =========================================================================
    slide13 = prs.slides.add_slide(blank_layout)
    add_bg(slide13)
    add_header(slide13, "Bank Integration Model: Inline Pre-Submit REST API", "REAL-WORLD DEPLOYMENT")
    
    int_box = slide13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.6), Inches(11.733), Inches(5.3))
    int_box.fill.solid()
    int_box.fill.fore_color.rgb = PANEL_BG
    int_box.line.color.rgb = ACCENT_CYAN
    itf = int_box.text_frame
    itf.margin_left = itf.margin_right = Inches(0.35)
    itf.margin_top = Inches(0.35)
    itf.word_wrap = True
    
    int_sections = [
        ("1. THE INTEGRATION ARCHITECTURE: Bank-Side REST API (Deployable Today)", [
            "• Shaheen runs as an internal microservice called by the bank's mobile app backend during PRE-SUBMIT.",
            "• Called BEFORE the transaction message is released to 1Link or Raast core clearing switches.",
            "• Single lightweight REST endpoint: POST /v1/assess (JSON in, JSON out, <850ms decision budget)."
        ]),
        ("2. ZERO CUSTOMER-FACING FRICTION & FALSE ALARM SAFEGUARDS:", [
            "• Legitimate payments (e.g. Hospital deposits, tuition fees) clear in 3 seconds with zero interruption.",
            "• High-coercion payments trigger step-up biometric auth or 15-minute protective escrow hold."
        ]),
        ("3. REGULATORY ALIGNMENT & STATUTORY GOVERNANCE:", [
            "• Fully compliant with State Bank of Pakistan (SBP) BPRD Circular No. 03 of 2023.",
            "• Direct statutory compliance with Anti-Money Laundering Act 2010 (AMLA) Section 7 reporting."
        ])
    ]
    for idx, (sect_title, bullets) in enumerate(int_sections):
        p = itf.paragraphs[0] if idx == 0 else itf.add_paragraph()
        p.text = "\n" + sect_title if idx > 0 else sect_title
        p.font.name = "Consolas"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = ACCENT_AMBER
        
        for b in bullets:
            pb = itf.add_paragraph()
            pb.text = b
            pb.font.name = "Arial"
            pb.font.size = Pt(11.5)
            pb.font.color.rgb = TEXT_WHITE

    # =========================================================================
    # SLIDE 14: Submission Summary & Links (Featuring Both Amaan Masood & Asifa Abbas)
    # =========================================================================
    slide14 = prs.slides.add_slide(blank_layout)
    add_bg(slide14)
    add_header(slide14, "Submission Deliverables & Team Shaheen", "HACK2SKILL FINAL SUBMISSION")
    
    # Left Box: Links & Summary
    l_box = slide14.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.6), Inches(6.8), Inches(5.3))
    l_box.fill.solid()
    l_box.fill.fore_color.rgb = PANEL_BG
    l_box.line.color.rgb = ACCENT_GREEN
    ltf = l_box.text_frame
    ltf.margin_left = ltf.margin_right = Inches(0.3)
    ltf.margin_top = Inches(0.3)
    ltf.word_wrap = True
    
    lp1 = ltf.paragraphs[0]
    lp1.text = "CHALLENGE TRACK: BFSI RISK & FRAUD"
    lp1.font.name = "Consolas"
    lp1.font.size = Pt(12)
    lp1.font.bold = True
    lp1.font.color.rgb = ACCENT_GREEN
    
    lp2 = ltf.add_paragraph()
    lp2.text = "\nPUBLIC GITHUB REPOSITORY:\nhttps://github.com/Amaan-Masood/shaheen-interceptor"
    lp2.font.name = "Consolas"
    lp2.font.size = Pt(11)
    lp2.font.color.rgb = ACCENT_CYAN
    
    lp3 = ltf.add_paragraph()
    lp3.text = "\nDEPLOYED PROTOTYPE ON GCP / CLOUD RUN:\nhttps://spry-analyzer-512016-m6.web.app\n(Alternative CDN: https://shaheen-interceptor.vercel.app)"
    lp3.font.name = "Consolas"
    lp3.font.size = Pt(11)
    lp3.font.color.rgb = ACCENT_AMBER
    
    lp4 = ltf.add_paragraph()
    lp4.text = "\nEMPIRICAL BENCHMARK CORPUS:\n40 Frozen Vectors | SHA-256: 9d650f03754dc84f02c637c4..."
    lp4.font.name = "Consolas"
    lp4.font.size = Pt(11)
    lp4.font.color.rgb = TEXT_WHITE

    # Right Box: Team Members Cards
    r_box = slide14.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.8), Inches(1.6), Inches(4.733), Inches(5.3))
    r_box.fill.solid()
    r_box.fill.fore_color.rgb = PANEL_BG
    r_box.line.color.rgb = ACCENT_CYAN
    rtf = r_box.text_frame
    rtf.margin_left = rtf.margin_right = Inches(0.3)
    rtf.margin_top = Inches(0.3)
    rtf.word_wrap = True
    
    rp1 = rtf.paragraphs[0]
    rp1.text = "TEAM SHAHEEN (MEMBERS):"
    rp1.font.name = "Consolas"
    rp1.font.size = Pt(13)
    rp1.font.bold = True
    rp1.font.color.rgb = ACCENT_CYAN
    
    rp2 = rtf.add_paragraph()
    rp2.text = "\n1. Amaan Masood (Leader)"
    rp2.font.name = "Arial Black"
    rp2.font.size = Pt(14)
    rp2.font.color.rgb = TEXT_WHITE
    
    rp3 = rtf.add_paragraph()
    rp3.text = "Email: amaanmasood69@gmail.com\nRole: Lead AI Architect & Full-Stack Engineer"
    rp3.font.name = "Consolas"
    rp3.font.size = Pt(10)
    rp3.font.color.rgb = TEXT_SLATE
    
    rp4 = rtf.add_paragraph()
    rp4.text = "\n2. Asifa Abbas (Team Member)"
    rp4.font.name = "Arial Black"
    rp4.font.size = Pt(14)
    rp4.font.color.rgb = ACCENT_AMBER
    
    rp5 = rtf.add_paragraph()
    rp5.text = "Email: asifaabbas007@gmail.com\nRole: FinTech & Regulatory Compliance Lead"
    rp5.font.name = "Consolas"
    rp5.font.size = Pt(10)
    rp5.font.color.rgb = TEXT_SLATE

    # Save PPTX
    output_pptx = os.path.join(os.path.dirname(__file__), "SHAHEEN_INTERCEPTOR_PITCH_DECK.pptx")
    prs.save(output_pptx)
    print(f"Presentation successfully created at: {output_pptx}")

if __name__ == "__main__":
    create_deck()
