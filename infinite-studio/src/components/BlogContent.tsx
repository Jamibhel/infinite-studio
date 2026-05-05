"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Clock, BookOpen, Search, X } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  readTime: string
  category: string
  image: string
  content?: string
  link?: string
}

const blogPosts: BlogPost[] = [
  {
    id: "lighting-101",
    title: "Mastering Studio Lighting: Three-Point Technique",
    excerpt:
      "Learn the professional three-point lighting setup from industry experts. Master key light, fill light, and back light patterns used by top photographers.",
    readTime: "8 min read",
    category: "Photography",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&h=400&fit=crop",
    content:
      "Three-point lighting is the foundation of professional studio photography, used by everyone from portrait photographers to fashion and beauty creators. Understanding this classic setup will elevate your content immediately.\n\nWHAT IS THREE-POINT LIGHTING?\n\nThree-point lighting consists of three essential light sources: the key light, fill light, and back light. Each serves a specific purpose in creating dimensional, flattering images that look professional and intentional.\n\nTHE KEY LIGHT\n\nThe key light is your primary light source and should be the brightest. It's typically positioned 45 degrees to the side of your subject and angled slightly downward. This creates the main shadows and defines the shape of your subject's face or body. The key light determines the overall mood and direction of your image.\n\nPosition it close enough to have impact but far enough to avoid harsh shadows. For portrait work, 4-6 feet away from your subject is ideal. If you want more dramatic shadows (fashion, dramatic portraits), position it more to the side. For softer, more flattering results, position it more toward the front.\n\nTHE FILL LIGHT\n\nThe fill light does exactly what it sounds like—it fills in the shadows created by the key light, reducing contrast and creating more flattering images. It's typically 50% the brightness of the key light (half the power or twice the distance). Position it on the opposite side of the key light, usually at the same height or slightly lower.\n\nFor beauty and commercial content, use less fill light for more drama. For fashion and editorial work, you might increase fill light to create a more polished, magazine-style look. The fill light is your control for how sculpted versus soft your image appears.\n\nTHE BACK LIGHT\n\nAlso called a rim light or hair light, the back light separates your subject from the background and adds depth to your image. Position it behind and above your subject, angled down toward them. It creates a rim of light around their hair or shoulders, making them pop off the background.\n\nThe back light should be brighter than the fill light but typically softer than the key light. It's crucial for creating three-dimensional images that don't look flat. Professional photographers consider this the most important light for creating that expensive, high-production-value look.\n\nPROFESSIONAL LIGHTING PATTERNS\n\nLoop Lighting: This is the most versatile pattern, with the key light creating a small shadow under the nose that resembles a loop. It works for almost any face shape and is the industry standard for beauty and editorial work.\n\nRembrandt Lighting: Named after the master painter, this pattern creates a triangular highlight on the darker side of the face. It's dramatic and artistic, perfect for editorial and high-fashion content.\n\nButterfly Lighting: The key light is positioned directly in front, creating symmetrical shadows below the nose and cheekbones. It's flattering and commonly used in commercial beauty photography.\n\nSplit Lighting: The key light is positioned 90 degrees to the side, illuminating exactly half the face. It's dramatic and moody, great for artistic and editorial work.\n\nPRO TIPS FOR STUDIO LIGHTING\n\n1. Invest in softboxes - They diffuse light and reduce harsh shadows, creating a more professional look than bare bulbs.\n\n2. Use reflectors as fill - You can bounce the key light with a white or silver reflector instead of using a third light, saving money and space.\n\n3. Gel your lights - Use color temperature gels to correct for different light sources and create creative color effects.\n\n4. Test before shooting - Always test your lighting setup before bringing in your talent. Small adjustments make huge differences.\n\n5. Keep your background separate - Use a third light on your background to keep it separate from your subject, adding depth and dimension.\n\nMastering three-point lighting is an investment in your content that pays dividends forever. Once you understand these principles, you can adapt them to any space and situation.",
  },
  {
    id: "behind-scenes",
    title: "Studio Setup: Learning from Professional Photographers",
    excerpt:
      "Discover how industry pros like Jeff Rojas, Julia Kuzmenko, and Jay P Morgan optimize their studio spaces. Apply their techniques to maximize content production.",
    readTime: "6 min read",
    category: "Studio Guide",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=600&h=400&fit=crop",
    content:
      "Professional photographers have perfected the art of organizing studio spaces for maximum efficiency and quality. Learning from their setups can transform your own content creation workflow.\n\nJEFF ROJAS'S PORTRAIT MASTERY\n\nJeff Rojas, a New York-based portrait and fashion photographer, has built his reputation on mastering light with simple, elegant setups. His key insight: constrain your choices to master your craft. Jeff typically works with one or two light sources rather than complex multi-light setups.\n\nHis signature technique uses parabolic softboxes—large, bowl-shaped light modifiers that create beautiful, directional light with natural falloff. By using parabolic softboxes, he creates portraits with three-dimensional modeling that's both flattering and professional. His YouTube channel demonstrates how simple equipment, when mastered, produces magazine-quality results.\n\nJULIA KUZMENKO'S BEAUTY PHOTOGRAPHY STANDARD\n\nJulia Kuzmenko Mckim, a celebrity and beauty photographer, has set the industry standard for photographing skin. Her philosophy: skin is three-dimensional, and your lighting should reflect that complexity.\n\nJulia uses contrast lighting to create texture and dimension. Rather than over-softening everything, she strategically places light to enhance skin texture while maintaining a polished, editorial look. Her studio setup includes:\n\nBeauty dishes for controlled, directional softness\nHigh-quality reflectors for subtle fill\nHair lights for separation\nStrategic background lighting\n\nHer breakthrough insight: the quality of your fill light matters as much as your key light. Many amateur setups use too-bright fill light, flattening the image. Julia uses minimal fill for maximum dimension.\n\nJAY P MORGAN'S COMMERCIAL EFFICIENCY\n\nJay P Morgan, a commercial photographer and director from Los Angeles, approaches studio setup from a production efficiency standpoint. His setup accommodates quick changes between different lighting patterns without moving major equipment.\n\nHis key principles:\n\n1. Modular equipment - Use stands and arms that allow quick repositioning\n2. Consistent positioning - Keep your key light stand in the same place; adjust height and angle rather than moving it\n3. Pre-test everything - Know your lighting patterns before the shoot begins\n4. Backup equipment - Have duplicate stands, bulbs, and modifiers ready\n\nSETTING UP YOUR OWN STUDIO SPACE\n\nZone Planning\n\nDivide your studio into zones:\n\nShooting Zone: Where your subject stands. Keep this clear of clutter. Your lighting should be positioned to control this space precisely.\n\nEquipment Zone: Where you store and organize lights, stands, reflectors, and props. Keep this organized for quick access during shoots.\n\nControl Zone: Where you monitor images, adjust settings, and direct your talent. Position your monitor and controls away from the shooting zone to avoid distractions.\n\nLight Management\n\nProfessionals organize lights by purpose:\nKey/Main light (your brightest, most important)\nFill lights (reflectors or secondary lights)\nHair/Back lights (for dimension)\nBackground lights (optional, for separation)\n\nLabel your light stands with tape. When you're in the flow of shooting, you want to grab the right light without thinking.\n\nCable Management\n\nThis isn't glamorous, but professionals spend significant time on it. Use cable organizers, duct tape, and clearly label power cables. A tripped cable mid-shoot destroys momentum and risks equipment damage.\n\nBackground Options\n\nProfessional photographers typically keep 2-3 background options ready:\nNeutral solid (white, gray, or black)\nTextured (brick, wood)\nNatural/organic (hanging fabric, plants)\n\nChanging backgrounds is quick and dramatically changes your content variety.\n\nSPACE OPTIMIZATION TIPS\n\n1. Vertical storage: Use wall-mounted racks for stands and modifiers\n2. Quick-release systems: Invest in quick-release plates for your modifiers\n3. Wireless monitoring: Use wireless triggers and remote monitors for more flexible positioning\n4. Height variety: Use different stands for varied light heights\n5. Testing area: Keep a small testing area for quick lighting checks\n\nThe professionals' secret isn't expensive equipment—it's intentional space organization that allows them to execute consistently and quickly.",
  },
  {
    id: "content-batching",
    title: "Content Batching: Shoot Efficiently Across Multiple Spaces",
    excerpt:
      "Maximize productivity by shooting multiple content pieces in one session. Learn professional batching techniques from production experts.",
    readTime: "7 min read",
    category: "Strategy",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
    content:
      "Content batching is the secret weapon of prolific creators. Instead of shooting one or two pieces at a time, batching means planning and executing multiple pieces of content in focused sessions. The efficiency gains are exponential.\n\nWHY BATCHING WORKS\n\nCreators who batch shoot report 4-5x productivity increases. Here's why:\n\nSetup costs amortized: You spend 30 minutes setting up lighting once instead of 30 minutes every day for a week.\n\nMental continuity: You're in the creative zone. Moving between different content types breaks that flow.\n\nEquipment consistency: All lighting is identical across shots, creating visual coherence in your content calendar.\n\nTalent/subject consistency: If you're working with models or talent, they're fresher early in the shoot.\n\nTHE BATCHING FRAMEWORK\n\nPhase 1: Planning (1-2 weeks before)\n\nSuccessful batching starts with meticulous planning. You'll need:\n\nContent themes: Group similar content together. Plan all portrait content, then all product content, then all lifestyle content.\n\nOutfit/styling: If you're on camera, have all outfits ready and organized. If you're shooting products, have all products staged.\n\nShot lists: Write specific shots for each piece. Don't wing it during the shoot.\n\nLighting setups: Sketch the lighting you'll use for each content type. Different genres need different approaches.\n\nBackup plans: What happens if a product is damaged? If lighting fails? Have contingencies.\n\nPhase 2: Logistics (Days before)\n\nTest your equipment: Charge all batteries, test all lights, check camera settings.\n\nPrepare the space: Clean your studio/location. Adjust backgrounds. Do a full test shoot with your setup.\n\nOrganize materials: Have everything the shoot needs accessible and organized.\n\nTeam coordination: If you have a team, brief them on the order of content and timeline.\n\nCreate a shot checklist: Print a checklist of every shot you need. Cross them off as you go.\n\nPhase 3: The Shoot (4-8 hours)\n\nStart with your most important content: When energy is highest, shoot your hero content—the pieces that matter most.\n\nGroup by lighting setup: Shoot all content that uses the same lighting before adjusting. This maximizes your setup efficiency.\n\nTake breaks strategically: After 2 hours of shooting, take a 15-minute break. Energy and creative perspective refresh.\n\nVariations matter: For each shot, capture 3-5 variations. Different angles, expressions, compositions. You'll thank yourself later.\n\nCapture B-roll and details: While you have everything set up, grab supplementary footage and detail shots.\n\nPhase 4: The Transition\n\nMoving between content types efficiently:\n\nAdjust only what's necessary: If switching from portrait to product, you might only need to change backgrounds and adjust light heights. Keep your key light in place.\n\nUse checklists: Have a checklist for each transition. Background changed, lights adjusted, test shot taken ensures nothing is missed.\n\nBuffer time: Allow 10-15 minutes between major content shifts for setup and testing.\n\nMULTI-SPACE BATCHING\n\nWhen you have access to multiple studio spaces (like Infinite Studio), batching becomes even more powerful:\n\nSpace 1 - Portrait content: Set up all portrait lighting. Shoot all portrait content here while the lighting is perfect.\n\nSpace 2 - Product/still life: Set up product lighting and background. Shoot all product content.\n\nSpace 3 - Lifestyle/environmental: Use natural or ambient lighting. Shoot all lifestyle content.\n\nIn one 8-hour session, you can capture 2-3 weeks of content across multiple aesthetic styles.\n\nTHE BATCHING CHECKLIST\n\nBefore the shoot:\nAll equipment tested and functional\nSpace prepared and cleaned\nOutfits/products organized\nShot lists printed\nTeam briefed\nLighting setups sketched\nBackup equipment ready\n\nDuring the shoot:\nStart with hero content\nTake variations of each shot\nUse shot checklist\nTake strategic breaks\nCapture B-roll\nTest lighting between setups\n\nAfter the shoot:\nBack up all footage immediately\nReview key footage for technical issues\nCreate a backup backup\n\nRESULTS TO EXPECT\n\nWithout batching: 2-3 pieces of content per week with inconsistent quality\n\nWith batching: 10-15 pieces of content in one session, all with consistent lighting and quality\n\nProlific creators aren't shooting every day—they're batching strategically and distributing strategically. Your content output will multiply when you adopt this approach.",
  },
  {
    id: "outfit-styling",
    title: "Wardrobe Strategy for Studio Content Creation",
    excerpt:
      "Discover what colors, styles, and fabrics work best in studio lighting. Learn styling strategies from fashion and beauty photographers.",
    readTime: "5 min read",
    category: "Styling",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    content:
      "What you wear dramatically impacts your content quality, yet many creators don't think strategically about wardrobe choices for the studio. Professional fashion and beauty photographers have specific guidelines that ensure your clothing enhances rather than distracts from your message.\n\nFABRIC MATTERS MORE THAN YOU THINK\n\nTextured fabrics photograph beautifully: Linen, cotton, silk, and wool with texture catch light and add visual interest. They photograph with dimension and depth.\n\nAvoid flat synthetics: Polyester blends and flat nylon can look cheap on camera. They don't reflect light naturally and often create unflattering shine.\n\nNatural fibers are your friend: Cotton, linen, silk, and wool have been used in fashion photography for decades for good reason. They move beautifully and photograph with natural luster.\n\nPattern guidelines: Tight patterns (small checks, fine stripes) can create moiré effects on camera—they vibrate and distract. Larger patterns, geometric shapes, and florals work better.\n\nCOLOR STRATEGY\n\nFor Light Backgrounds: Darker clothing creates contrast and makes you stand out. Black, deep navy, jewel tones (emerald, sapphire, burgundy) all pop against white or light gray backgrounds.\n\nFor Dark Backgrounds: Light clothing is essential. Whites, creams, pastels, and bright colors separate you from the background and prevent you from blending in.\n\nUniversal Colors: These work with most backgrounds and lighting:\nNavy blue\nCharcoal gray\nDeep burgundy\nJewel tones (emerald, sapphire, amethyst)\nWarm terracotta and rust\n\nColors to Approach Carefully:\nRed: Can bloom in certain lighting and create strange color casts. Test under your studio lights first.\nWhite: Can blow out and create glare unless you expose carefully. Use cream if you want a light color.\nNeon/bright colors: Can dominate the frame and look cheap. Unless that's the aesthetic, stick to deeper, more sophisticated colors.\n\nFIT AND MOVEMENT\n\nOversized can be flattering: Loose, structured clothing often photographs better than tight clothing, which emphasizes every contour.\n\nTest the stretch: Move your arms, twist, and bend in your intended outfit under studio lights. Does it pull? Wrinkle? Move awkwardly?\n\nLayering adds dimension: A fitted base layer with a looser outer layer creates visual interest. A sweater over a t-shirt over a tank top creates textural variety.\n\nAvoid transparent fabrics: Unless intentional, semi-transparent clothing is distracting on camera. Wear appropriate undergarments or choose opaque fabrics.\n\nSPECIFIC STUDIO SCENARIOS\n\nPortrait Sessions: Choose one statement piece: Either a notable color/pattern top or interesting bottoms, but not both. You want attention on your face, not your outfit. Neutral basics (white t-shirt, navy sweater) let your face be the star. This is why runway models wear simple clothing—it doesn't compete.\n\nProduct-Focused Content: Wear neutral colors: grays, blacks, whites, and warm neutrals. Your clothing should complement, not compete with, your product.\n\nLifestyle/Editorial: More freedom here, but still strategic. Complementary colors (if you wear blue, avoid orange unless it's an intentional contrast). Seasonal colors work well—warm tones in fall/winter, cool tones in spring/summer.\n\nTHE PROFESSIONAL WARDROBE ESSENTIALS\n\nBuild a content creator wardrobe with these essentials:\n\n1. Neutral bases: 3-4 well-fitting basic t-shirts and sweaters in white, gray, black, and navy\n2. Statement pieces: 2-3 interesting tops with texture, pattern, or unique color\n3. Layering pieces: Blazers, cardigans, overshirts in neutral tones\n4. Bottoms: Well-fitting jeans (dark preferred), neutral pants, and one statement bottom\n5. Texture pieces: Textured sweaters, knit tops, anything with visual interest\n6. Seasonal colors: Adjust your palette for the season\n\nPRE-SHOOT TESTING\n\nNever wear something to the shoot you haven't tested under your studio lights. What looks good in mirror can look terrible under studio lighting.\n\nTry it on under your actual lighting\nPhotograph yourself\nCheck for wrinkles, fitting issues, and color accuracy\nDo a short video test—movement shows issues\n\nOUTFIT ROTATION\n\nFor a full-day batch shoot, plan 3-5 different outfits. Change between content pieces to provide visual variety. Your audience will appreciate seeing you in different looks.\n\nTHE HIDDEN IMPACT\n\nWhen you feel confident in what you're wearing, it shows on camera. When you're uncomfortable or self-conscious about your outfit, that energy translates. Choose clothing that fits perfectly, feels comfortable, and makes you feel powerful. Professional creators know that confidence is the best outfit accessory.",
  },
  {
    id: "gear-guide",
    title: "Professional Gear Guide for Content Creators",
    excerpt:
      "Build your content toolkit with Nigerian pricing. Learn equipment recommendations from industry leaders.",
    readTime: "6 min read",
    category: "Equipment",
    image: "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=600&h=400&fit=crop",
    content:
      "Professional studio content requires investment in quality equipment, but you don't need everything at once. Understanding what matters most helps you build your kit strategically.\n\n## The Camera: Your Foundation\n\n### Professional Options\n\n**Canon EOS R5** (₦1,950,000): Full-frame mirrorless, 45MP sensor, excellent autofocus, 8K video capability. Industry standard for professionals.\n\n**Sony A7IV** (₦1,249,000): Full-frame mirrorless, 61MP sensor, exceptional autofocus, reliable color science. Growing favorite among content creators.\n\n**Nikon Z6 III** (₦1,498,000): Full-frame mirrorless, 24MP sensor (lower than others but exceptional low-light), professional build quality.\n\n**Canon R50** (₦499,500): Entry-level mirrorless, 24MP, great for beginners wanting professional quality without the price.\n\n**Why mirrorless?** Fast autofocus, real-time exposure preview, and compact size. DSLRs are being phased out as mirrorless improves.\n\n## Lenses: The Secret Weapon\n\nOne exceptional lens beats a collection of mediocre ones.\n\n### Essential Prime Lenses\n\n**50mm f/1.8** (₦75,000-150,000): The standard portrait lens. Fast aperture allows shallow depth of field and works well in low light. Buy this first.\n\n**35mm f/1.8** (₦150,000-300,000): For fuller-body portraits and lifestyle content. Less compressed than 50mm, more environmental context.\n\n**85mm f/1.4** (₦600,000-1,000,000): The ultimate portrait lens for professionals. Gorgeous compression, buttery bokeh. An investment that lasts a career.\n\n**24-70mm f/2.8** (₦750,000-1,500,000): Professional standard. Not as fast as primes but versatile for multiple shot types.\n\n**70-200mm f/2.8** (₦500,000-1,000,000): For compressed portraits and environmental portraits. Professional-grade compression.\n\n### Budget Strategy\n\nStart with: 50mm f/1.8 + 24-70mm f/2.8\nAdd later: 85mm f/1.4 + 35mm f/1.8\n\n## Lighting: The Biggest ROI\n\nLighting upgrades impact your image quality more than any other investment.\n\n### Continuous Lights (Best for beginners)\n\n**Softbox kits**: ₦100,000-300,000\n- LED lights are modern, cool, and daylight-balanced\n- Softboxes diffuse light beautifully\n- Available at Jumia, Kano electronics markets, Lagos photography shops\n\n### Strobe/Flash Lights (Professional)\n\n**Profoto B10/B10 Plus** (₦1,497,500): Industry standard. Recycles fast, powerful, reliable. Used by 80% of professional studios across Africa.\n\n**Godox SL-60W**: Budget alternative at ₦200,000-300,000. 95% of the quality for 20% of the price. Available in major Nigerian electronics hubs.\n\n### Light Modifiers\n\n**Softboxes** (₦50,000-200,000): Essential for diffusing light\n**Beauty dishes** (₦100,000-300,000): Professional beauty and portrait photography\n**Umbrellas** (₦15,000-50,000): Budget diffusion option\n**Reflectors** (₦10,000-50,000): For fill and bounce light\n\n### Support & Stands\n\n**Heavy-duty light stands**: ₦25,000-75,000 each. You need at least 2-3. Don't cheap out—light stands that tip are expensive and dangerous.\n\n**C-stands**: ₦50,000-100,000. More rigid than light stands, better for back lights and precise positioning.\n\n**Boom arms**: ₦25,000-75,000. Extend your light reach without moving stands.\n\n**Background support system**: ₦100,000-200,000. Allows easy background changes.\n\n### Backgrounds\n\n**Seamless paper**: ₦10,000-15,000 per roll. Comes in various colors. Easy to damage; you'll replace often.\n\n**Vinyl/fabric backgrounds**: ₦50,000-150,000. Reusable, more professional, but require space storage.\n\n**DIY option**: Paint muslin fabric or use textured drop cloths as backgrounds. Very affordable in Nigerian markets.\n\n### Audio Equipment\n\n**Rode Wireless GO II**: ₦150,000. Tiny, reliable, industry standard for content creators.\n\n**Rode Shotgun mic**: ₦100,000. Desktop mounted for interviews and presentations.\n\n**Decent Audio Interface**: ₦50,000-150,000. Ensures professional audio quality.\n\n### Optional But Valuable\n\n**Light meter**: ₦25,000-100,000. Takes guesswork out of exposure. Worth it if you shoot strobe lights.\n\n**Wireless triggers**: ₦25,000-75,000. Control strobes from your camera position.\n\n**Color checker**: ₦50,000-100,000. Ensures accurate color in post-production.\n\n**Backup batteries and memory cards**: ₦50,000-150,000. Never run out mid-shoot.\n\n## Recommended Budget Builds\n\n### Beginner (₦350,000-500,000)\n- Camera body: Used Canon R50 or Sony A6400 (₦250,000)\n- Lens: 50mm f/1.8 (₦75,000)\n- Lighting: Continuous LED softbox kit (₦100,000)\n- Stands: 2x light stands (₦25,000)\n- Background: Seamless paper (₦15,000)\n- Audio: USB mic (₦25,000)\n\n### Intermediate (₦2,000,000-3,000,000)\n- Camera: Canon R5 or Sony A7IV (₦1,249,000)\n- Lenses: 50mm f/1.8 + 24-70mm f/2.8 (₦400,000)\n- Lighting: Profoto B10 + 2x softboxes (₦1,750,000)\n- Stands/support: Proper stands + boom arm (₦200,000)\n- Background system (₦150,000)\n- Audio: Rode Wireless GO II (₦150,000)\n\n### Professional (₦5,000,000+)\n- Camera: Canon R5 + backup body (₦4,000,000)\n- Lenses: 35mm, 50mm, 85mm primes (₦2,000,000)\n- Lighting: 2x Profoto B10 + various modifiers (₦3,500,000)\n- Support: Professional-grade stands, arms, rails (₦1,000,000)\n- Background system: Multiple fabric options (₦500,000)\n- Audio/monitoring: Full setup (₦1,000,000)\n\n## Pro Tips for Nigerian Creators\n\n1. **Buy from authorized dealers**: Warranty matters when equipment fails. Check prices at Jumia, Kano electronics plaza, and major Lagos photography shops.\n\n2. **Import strategy**: Consider bulk imports from international suppliers. Duty and clearance fees typically add 15-20% to landed cost.\n\n3. **Join Nigerian photography communities**: Connect with other creators for equipment sharing, bulk purchasing, and advice.\n\n4. **Prioritize quality over quantity**: One excellent lens beats three mediocre ones.\n\n5. **Test before buying**: Rent equipment from local shops before committing to purchase.\n\n6. **Lighting > camera**: Upgrade your lighting before your camera body.\n\n7. **Budget flexibility**: Nigerian market pricing fluctuates. Build in 10% buffer for currency changes.\n\nYour gear investment is in your future content quality. Start with essentials and upgrade strategically based on your needs.",
  },
  {
    id: "sound-design",
    title: "Beauty Photography: Lighting for Flattering Skin",
    excerpt:
      "Learn professional beauty lighting techniques from celebrity photographer Julia Kuzmenko Mckim. Create glowing, flattering skin tones in your studio content.",
    readTime: "5 min read",
    category: "Photography",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&h=400&fit=crop",
    content:
      "Beauty photography is a specialized skill that combines technical lighting knowledge with an understanding of skin, color, and editorial aesthetics. Celebrity photographer Julia Kuzmenko Mckim has perfected these techniques and shares her philosophy with aspiring photographers.\n\n## The Goal: Flattering, Dimensional Skin\n\nThe objective in beauty photography isn't to eliminate all imperfections (that's what retouching is for), but rather to light skin in a way that looks three-dimensional, glowing, and inherently beautiful.\n\n## The Beauty Lighting Philosophy\n\n### Contrast is Your Tool\n\nJulia's key insight: skin has texture and dimension. Rather than over-softening everything with flat, diffused light, strategic placement of light creates separation and interest.\n\n**Subtle shadows** create definition. Think about how different they are:\n- A face with zero shadows looks flat and one-dimensional\n- A face with harsh shadows looks harsh and unflattering\n- A face with subtle, well-placed shadows looks sculpted and professional\n\n### The Golden Hour Effect\n\nYou don't need golden hour light to achieve golden hour results. Professional photographers recreate that warm, dimensional light using:\n\n- Warm color temperature (3200-5600K)\n- Side/three-quarter key light positioning\n- Controlled fill light that preserves shadows\n- Optional warm reflectors for fill\n\n## Professional Beauty Lighting Patterns\n\n### Butterfly Lighting\n\nPositioned: Key light directly in front, slightly above the subject\nEffect: Creates symmetrical shadows under the nose (shaped like a butterfly)\nBest for: Commercial beauty, flattering and forgiving\nWhy it works: Very few face shapes look bad in butterfly lighting\n\n### Loop Lighting\n\nPositioned: Key light 45 degrees to the side\nEffect: Small shadow under the nose\nBest for: Editorial beauty, portraits\nWhy it works: Versatile, works for most face shapes and skin tones\n\n### Rembrandt Lighting\n\nPositioned: Key light 45 degrees, creating a triangular highlight on the shadow side\nEffect: More dramatic, painterly\nBest for: High fashion, artistic beauty photography\nWhy it works: Creates dimension and visual interest\n\n### Paramount Lighting\n\nPositioned: Key light directly in front and above\nEffect: Subtle shadows, very flattering\nBest for: Commercial beauty, glamour shots\nWhy it works: Nearly every face looks good in paramount lighting\n\n## Light Quality: Hard vs. Soft\n\n### Hard Light\n\n**Tools**: Reflectors, bare bulbs, parabolic softboxes\n**Effect**: Creates distinct shadows, visible texture\n**Best for**: Commercial beauty (shows skin texture), artistic photography\n**Caution**: Can be unflattering for blemishes or textured skin\n\n### Soft Light\n\n**Tools**: Large softboxes, umbrellas, diffusion panels\n**Effect**: Diffuse shadows, glowing appearance\n**Best for**: Glamour, editorial, beauty, fragrance\n**Why professionals prefer it**: More forgiving while still flattering\n\n## Fill Light Strategy\n\nThis is where amateur beauty photographers often fail. Too much fill light flattens the image. Too little creates unflattering shadows.\n\n**Professional ratio**: Key light to fill light is typically 3:1 or 4:1\n\nExample: If your key light is 200 watts at 4 feet, your fill light should be 50 watts at the same distance, or 100 watts at double the distance.\n\n**Fill light sources**:\n- Reflector (most common in beauty photography)\n- Second light set to lower power\n- White surface bounce\n\n## Back Light and Separation\n\nProfessional beauty photography uses back light (hair light) to separate the subject from the background. This adds dimension and prevents the subject from blending into the background.\n\n**Back light positioning**: Behind and above the subject, angled downward\n**Back light power**: Usually equal to or slightly less than the fill light\n**Back light effect**: Creates rim light on hair, shoulders, and edges\n\n## Color Temperature and Skin Tone\n\n### Warm Color Temperature (3200K)\n\n**Effect**: Creates golden, warm skin tones\n**Best for**: Warm skin tones (deep, olive, warm undertones)\n**Achieves**: The luxury/editorial golden hour look\n\n### Neutral Color Temperature (5600K)\n\n**Effect**: Neutral, true-to-life rendering\n**Best for**: All skin tones, especially cool and neutral undertones\n**Achieves**: Clean, modern, commercial look\n\n### Color Gels\n\nProfessionals use color correction gels to match different light sources or create intentional color casts:\n- CTO (Color Temperature Orange) gels warm cool light\n- CTB (Color Temperature Blue) gels cool warm light\n- Specialty gels create fashion effects\n\n## The Beauty Photography Setup\n\n**Key light**: Beauty dish or large softbox, positioned as per your chosen pattern\n**Fill light**: Reflector or secondary light at lower power\n**Back light**: Optional but highly recommended, positioned behind subject\n**Background light**: Optional, separates subject from background\n**Background**: Neutral (white, gray, black) or complementary color\n\n## Pro Tips from Julia Kuzmenko\n\n1. **Test, test, test**: Always do a test shot before your talent arrives. Review it on a monitor, not on your camera screen.\n\n2. **Position your fill light carefully**: Move it forward/back to control shadow depth. Forward = less shadow, back = more shadow.\n\n3. **Use a large reflector**: Even if it seems overkill, beauty photography benefits from large, effective fill surfaces.\n\n4. **Watch the catch light**: The reflection of light in the eye should be beautiful and appealing. Position your key light to create professional catch lights.\n\n5. **Color-grade in post**: Beauty photography is finished in post-production. White balance, tone mapping, and subtle adjustments are standard.\n\n6. **Invest in skin color accuracy**: Use a color checker during your shoot. It pays enormous dividends in post-production.\n\n## Skin Type Considerations\n\n### Oily or Textured Skin\n\nUse softer light (larger softbox) and reduce hard light contrast. Softer light is more forgiving of imperfections.\n\n### Dry or Sensitive Skin\n\nCan handle slightly harder light. The texture might be less, but you have more flexibility in positioning.\n\n### Mature Skin\n\nSlightly harder light can actually be flattering, creating definition. But ensure fill light is adequate to avoid harsh shadows.\n\n### All Skin Types\n\nEnsure adequate fill light. This is universal across skin types and the most critical element of flattering beauty lighting.\n\nMastery of beauty lighting takes time and practice. Start with butterfly or paramount lighting, perfect your positioning, then experiment with variations. Your skin will thank you.",
  },
]

const categories = ["All", ...new Set(blogPosts.map((post) => post.category))]

export function BlogContent() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <main
      className="pt-32 pb-20 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="heading-h1 mb-4">Creator Resources & Tips</h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
            Learn from the community and level up your content creation with our comprehensive guides and insider tips
          </p>
        </motion.div>

        {/* SEARCH BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-3.5" size={20} style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            />
          </div>
        </motion.div>

        {/* CATEGORY FILTERS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="px-4 py-2 rounded-full font-semibold text-sm transition-all"
              style={{
                backgroundColor:
                  selectedCategory === category ? "var(--cta-primary)" : "var(--surface)",
                color: selectedCategory === category ? "white" : "var(--text-muted)",
                border: `2px solid ${selectedCategory === category ? "var(--cta-primary)" : "var(--border)"}`,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* POSTS GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                onClick={() => {
                  if (post.link) {
                    window.open(post.link, "_blank")
                  } else {
                    setSelectedPost(post)
                  }
                }}
                className="group card card-hover overflow-hidden flex flex-col cursor-pointer"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                  border: "2px solid var(--border)",
                  borderRadius: "12px",
                }}
              >
                {/* Image Header */}
                <div
                  className="w-full h-32 bg-cover bg-center group-hover:scale-105 transition-transform duration-300 relative"
                  style={{
                    backgroundImage: `url('${post.image}')`,
                  }}
                >
                  <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-start justify-between mb-2">
                    <span
                      className="text-xs font-semibold px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: "var(--surface)",
                        color: "var(--cta-primary)",
                        border: "1px solid var(--cta-primary)",
                      }}
                    >
                      {post.category}
                    </span>
                    <div
                      className="flex items-center gap-1 text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <Clock size={14} />
                      {post.readTime}
                    </div>
                  </div>

                  <h3 className="heading-h3 mb-3 mt-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm flex-grow" style={{ color: "var(--text-muted)" }}>
                    {post.excerpt}
                  </p>

                  {/* CTA */}
                  <div
                    className="mt-4 pt-4 border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {post.link ? (
                      <a href={post.link} target="_blank" rel="noopener noreferrer">
                        <button
                          className="text-sm font-semibold flex items-center gap-2 transition-all group/btn"
                          style={{ color: "var(--cta-primary)" }}
                        >
                          Read Source
                          <ArrowRight
                            size={16}
                            className="group-hover/btn:translate-x-1 transition-transform"
                          />
                        </button>
                      </a>
                    ) : (
                      <button
                        className="text-sm font-semibold flex items-center gap-2 transition-all group/btn"
                        style={{ color: "var(--cta-primary)" }}
                      >
                        Read More
                        <ArrowRight
                          size={16}
                          className="group-hover/btn:translate-x-1 transition-transform"
                        />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="col-span-full text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p style={{ color: "var(--text-muted)" }}>
                No articles found matching your search.
              </p>
            </motion.div>
          )}
        </div>

        {/* FEATURED SECTION */}
        {filteredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="p-8 rounded-lg overflow-hidden"
            style={{
              backgroundColor: "var(--surface)",
              border: "2px solid var(--cta-primary)",
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4"
                  style={{
                    backgroundColor: "var(--cta-primary)",
                    color: "white",
                  }}
                >
                  Featured
                </span>
                <h2 className="heading-h2 mb-4">{filteredPosts[0].title}</h2>
                <p className="max-w-2xl" style={{ color: "var(--text-muted)" }}>
                  {filteredPosts[0].content || filteredPosts[0].excerpt}
                </p>
                <div className="flex items-center gap-4 mt-6">
                  <span
                    className="text-sm font-semibold"
                    style={{
                      backgroundColor: "var(--surface)",
                      color: "var(--cta-primary)",
                      border: "1px solid var(--cta-primary)",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      display: "inline-block",
                    }}
                  >
                    {filteredPosts[0].category}
                  </span>
                  <span
                    className="flex items-center gap-1 text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Clock size={16} />
                    {filteredPosts[0].readTime}
                  </span>
                </div>
              </div>
              <ArrowRight
                size={32}
                style={{ color: "var(--cta-primary)" }}
                className="flex-shrink-0"
              />
            </div>
          </motion.div>
        )}

        {/* ARTICLE MODAL */}
        {selectedPost && !selectedPost.link && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPost(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-8"
              style={{
                backgroundColor: "var(--surface)",
                color: "var(--text-primary)",
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-opacity-20 transition-colors"
                style={{ color: "var(--text-primary)" }}
              >
                <X size={24} />
              </button>

              {/* Article Image */}
              <div
                className="w-full h-64 bg-cover bg-center rounded-lg mb-6"
                style={{
                  backgroundImage: `url('${selectedPost.image}')`,
                }}
              />

              {/* Category & Read Time */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: "var(--surface)",
                    color: "var(--cta-primary)",
                    border: "1px solid var(--cta-primary)",
                  }}
                >
                  {selectedPost.category}
                </span>
                <div
                  className="flex items-center gap-1 text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Clock size={16} />
                  {selectedPost.readTime}
                </div>
              </div>

              {/* Title */}
              <h1 className="heading-h1 mb-6">{selectedPost.title}</h1>

              {/* Content */}
              <div className="space-y-4">
                {selectedPost.content?.split('\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('##')) {
                    return (
                      <h2 key={idx} className="heading-h2 mt-6 mb-3">
                        {paragraph.replace(/^##\s*/, '')}
                      </h2>
                    )
                  }
                  if (paragraph.startsWith('###')) {
                    return (
                      <h3 key={idx} className="heading-h3 mt-4 mb-2">
                        {paragraph.replace(/^###\s*/, '')}
                      </h3>
                    )
                  }
                  if (paragraph.startsWith('• ') || paragraph.startsWith('- ')) {
                    return (
                      <div key={idx} className="flex gap-3 ml-4">
                        <span style={{ color: "var(--cta-primary)", fontWeight: 'bold' }}>•</span>
                        <p style={{ color: "var(--text-primary)" }}>
                          {paragraph.replace(/^[•\-]\s*/, '')}
                        </p>
                      </div>
                    )
                  }
                  if (paragraph.startsWith('1. ') || paragraph.match(/^\d+\./)) {
                    const match = paragraph.match(/^\d+\.\s*(.*)/)
                    const numMatch = paragraph.match(/^\d+/)
                    return (
                      <div key={idx} className="flex gap-3 ml-4">
                        <span style={{ color: "var(--cta-primary)", fontWeight: 'bold' }}>
                          {numMatch?.[0]}.
                        </span>
                        <p style={{ color: "var(--text-primary)" }}>
                          {match?.[1]}
                        </p>
                      </div>
                    )
                  }
                  if (paragraph.trim() === '') {
                    return <div key={idx} className="h-2" />
                  }
                  if (paragraph.match(/^\*\*/) || paragraph.includes('**')) {
                    // Handle bold text
                    const parts = paragraph.split(/\*\*/)
                    return (
                      <p key={idx} style={{ color: "var(--text-primary)", lineHeight: '1.8' }}>
                        {parts.map((part, i) => 
                          i % 2 === 0 ? part : <strong key={i}>{part}</strong>
                        )}
                      </p>
                    )
                  }
                  return (
                    <p key={idx} style={{ color: "var(--text-primary)", lineHeight: '1.8' }}>
                      {paragraph}
                    </p>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </main>
  )
}
