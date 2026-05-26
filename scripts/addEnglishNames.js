const fs = require('fs');

const products = JSON.parse(fs.readFileSync('./data/deduped-products.json', 'utf-8'));

// English name mapping based on official brand websites
const EN_NAMES = {
  // 3C Accessories
  'Anker安克 如意棒充电宝（2万，220W) ': 'Anker 737 Power Bank (20K, 220W)',
  'Anker 安克小善果充电器（45W,1C,配C-C线）黑': 'Anker Nano Charger 45W',
  'Anker安克 灵光智显充电器（140W,3C1A,配C-C线）': 'Anker Prime 140W GaN Charger',
  'Soundcore AeroFit 声阔 不入耳蓝牙耳机': 'soundcore AeroFit Open-Ear Headphones',
  'Soundcore AeroClip 声阔不入耳蓝牙耳机（白色）': 'soundcore AeroClip Open-Ear Earbuds',
  'Soundcore声阔 Liberty 4 Pro声阔降噪蓝牙耳机(黑）': 'soundcore Liberty 4 Pro ANC Earbuds',
  'Soundcore声阔 深睡舱A30睡眠耳机（白）': 'soundcore Sleep A30 Earbuds',
  'Soundcore声阔 可穿戴式AI录音笔': 'soundcore Wearable AI Voice Recorder',
  'Anker安克 Prime桌面充电器（250W,4C2A，氮化镓)': 'Anker Prime Desktop Charger 250W',
  'Anker安克Zolo移动电源（2.5万，165w，自带双线）黑': 'Anker Zolo Power Bank (25K, 165W)',
  'Anker安克 Nano移动电源能量卡Air超薄磁吸充电宝（5K,超薄磁吸）': 'Anker Nano Power Bank MagSafe (5K)',
  'Anker安克 Zolo充电器（70W,4 Ports）黑色': 'Anker Zolo Charger 70W',
  'Anker安克 Nano充电器（45W,1C,带显屏）白': 'Anker Nano Charger 45W with Display',
  'Anker安克 任逍遥充电宝（1万，30W，自带USB-C线）': 'Anker Power Bank 10K 30W',
  'Anker安克 Nano移动电源能量盒伸缩线充电宝（10K,45W,自带伸缩USB-C线）白': 'Anker Nano Power Bank 10K 45W',
  'Anker充电器（100w，3口，带屏显，配USB-C线）': 'Anker 100W 3-Port GaN Charger',
  'NOTHING CMF buds 2': 'Nothing CMF Buds 2',
  'NOTHING headphone': 'Nothing Headphone (1)',
  'MOFT X磁吸版手机卡夹支架': 'MOFT X MagSafe Phone Stand & Wallet',
  '图拉斯-立充系列手机支架壳 (旋转炫彩版)': 'TORRAS PixFusion Rotating Phone Case Stand',
  '图拉斯-Park O Pro手机支架壳(磨砂版)': 'TORRAS Park O Pro Phone Case Stand',
  '耐尔金折叠键盘适用苹果ipad平板蓝牙无线妙控小型便携触控板手机笔记本电脑专用': 'Nillkin Bluetooth Foldable Keyboard with Touchpad',
  'MOVAS™ Tech Leather Case   MOVAS™ 科技皮革妙磁壳': 'MOFT MOVAS™ Tech Leather MagSafe Case',
  'MOFT MOVAS™ 科技皮革妙磁壳': 'MOFT MOVAS™ Tech Leather MagSafe Case',
  '闪极-锻造碳纤维磁吸移动电源C3 5000mAh': 'Shargeek Carbon Fiber MagSafe Power Bank C3 (5K)',
  '闪极-22.5W随行mini移动电源': 'Shargeek Mini 22.5W Power Bank',
  '闪极-170W赛博棱镜移动电源-白': 'Shargeek Cyber Prism 170W Power Bank',
  '制糖工厂硬糖120W小电拼套装': 'Sugar Factory 120W Charger Kit',
  '图拉斯-小云宝系列自带线移动电源 (10000mAh)': 'TORRAS Cloud Power Bank with Built-in Cable (10K)',

  // Coffee
  'Cocinare BrewKit Master 手冲套装': 'Cocinare BrewKit Master Pour-Over Set',
  'Cocinare X 忍者龟 联名二合一磨豆机': 'Cocinare × TMNT 2-in-1 Coffee Grinder',
  'Cocinare加菲猫联名TasteSet': 'Cocinare × Garfield TasteSet',
  'Cocinare忍者神龟联名TasteSet': 'Cocinare × TMNT TasteSet',
  'Cocinare加菲猫联名温控手冲壶': 'Cocinare × Garfield Temperature Control Kettle',
  'Cocinare忍者神龟联名温控手冲壶': 'Cocinare × TMNT Temperature Control Kettle',
  'Cocinare海绵宝宝联名盲盒品鉴杯': 'Cocinare × SpongeBob Blind Box Tasting Cup',
  'Cocinare山本修的猫联名限量艺术猫盲盒': 'Cocinare × Artist Cat Limited Edition Blind Box',
  'Wright玻璃杯-160mL': 'Wright Glass Cup 160mL',
  'Wright玻璃杯-限量版-手绘-240mL': 'Wright Hand-Painted Glass Cup 240mL (Limited)',
  '小魔方咖啡秤3.0 micro-黑色': 'Mini Cube Coffee Scale 3.0 Micro',
  '驭-旋风搅粉针-58mm通用': 'YU Coffee Distribution Needle 58mm',
  '驭-无级布粉器-58.35mm': 'YU Stepless Coffee Distributor 58.35mm',
  '骑士粉锤-螺纹底-黑色-58.35mm': 'Knight Coffee Tamper 58.35mm',
  '旗舰版5.0拉花缸-磨砂黑-500mL': 'Flagship 5.0 Latte Art Pitcher 500mL',
  'X-press58意式咖啡机': 'X-press 58 Espresso Machine',
  '航海家F74磨豆机-黑色': 'Navigator F74 Coffee Grinder',

  // Entertainment
  '帆书声声AI读书机': 'Fanbook AI Smart Reader',
  'FUN  TECH LAB  windsible桌面风洞': 'FUN TECH LAB Windsible Desktop Wind Tunnel',
  'Phantom 智能国际象棋': 'Phantom Smart Chess Board',
  '极械艺术摆件 机械魔鬼鱼/机械鹦鹉螺/机械鲸鱼': 'Jixie Mechanical Art Sculpture',
  '迷你沙画机': 'Mini Sand Art Machine',
  'Livtab Cyber One模块化升降桌 ': 'Livtab Cyber One Modular Standing Desk',

  // Tools
  'HOTO小猴 车载吹吸一体机Pro': 'HOTO Car Vacuum & Blower Pro',
  'HOTO小猴 精修工具本': 'HOTO Precision Tool Kit',
  'HOTO小猴 PIXEL DRIVE电动螺丝刀套装': 'HOTO PixelDrive Cordless Screwdriver',
  'HOTO小猴 SNAPBLOQ™先锋版电动精修套装': 'HOTO SNAPBLOQ™ Pioneer Precision Tool Kit',
  '知象光电Revopoint INSPIRE 2 三维扫描仪 ': 'Revopoint INSPIRE 2 3D Scanner',
  '墨案 mini ultra 电子阅读器 ': 'MOAAN Mini Ultra E-Reader',
  '　HOZO超声波切割刀替换刀片01x20pcs（含弃置刀盒）': 'HOZO Ultrasonic Cutter Replacement Blades (20pcs)',
  'HOZO超声波切割刀超级充电底座套装': 'HOZO Ultrasonic Cutter Super Charging Dock',
  'HOZO超声波切割刀': 'HOZO Ultrasonic Cutter',

  // MakerSpace
  'LaserPecker LX2一站式多功能激光切割机': 'LaserPecker LX2 All-in-One Laser Cutter',
  'xTool F2 Ultra UV紫光雕刻机': 'xTool F2 Ultra UV Laser Engraver',
  'xTool F2 Ultra 4类-黑灰色': 'xTool F2 Ultra 60W MOPA Dual Laser Engraver',
  'xTool_F1 Ultra激光雕刻机': 'xTool F1 Ultra Laser Engraver',
  'Xhorse3D Xmachine XM-100 桌面五轴加工中心': 'Xhorse 3D Xmachine XM-100 Desktop 5-Axis CNC',
  '创想三维 3D打印机 激光雕刻机 扫描仪': 'Creality 3D Printer, Laser Engraver & Scanner',
  'Laserpecker激光啄木鸟 雕刻机': 'LaserPecker Laser Engraver',
  'Xhorse 3D 桌面五轴加工中心': 'Xhorse 3D Desktop 5-Axis CNC',
  'eufyMake E1 UV打印机': 'eufyMake E1 UV Printer',
  'xTool DTF打印机+全自动烘烤机组合套件': 'xTool DTF Printer + Auto Heat Press Bundle',
  'Snapmaker U1': 'Snapmaker U1',

  // AI Custom
  '人偶': 'Custom AI-Generated Figure',
  '原子智造AtomStack P1 5W便携雕刻机白色': 'AtomStack P1 5W Portable Laser Engraver',
  '冰箱贴UV定制': 'UV Custom Fridge Magnets',

  // Gaming
  '清闲动态人机工学椅 Pro 人体工学椅': 'Clearview Dynamic Ergonomic Chair Pro',
  'TGIF拓际 T0 Ultra 电竞人体工学椅': 'TGIF T0 Ultra Gaming Ergonomic Chair',
  '破茧X三模游戏鼠标': 'Pojun X Tri-Mode Gaming Mouse',
  '破茧75机械键盘 K1 Pro': 'Pojun 75 Mechanical Keyboard K1 Pro',
  '怒喵鼠标电竞游戏无线Infinity Mouse轻量化蓝牙鼠标办公人体工学': 'Angry Miao Infinity Mouse Wireless',
  'Keychron': 'Keychron Mechanical Keyboard',
  '清闲人体工学椅': 'Clearview Ergonomic Chair',
  '清闲LiberNovo Omni动态人体工学椅 绿色限定色': 'Clearview LiberNovo Omni Dynamic Ergonomic Chair',

  // Audio & Video
  'ViewX 裸眼3D空间智能显示器': 'ViewX Glasses-Free 3D Spatial Display',
  '恩雅赛博 口袋无弦吉他': 'Enya Cyber Pocket Air Guitar',
  '哈曼卡顿5代琉璃音响': 'Harman Kardon Onyx Studio 5',
  'Haloasis A1全息歌词音响': 'Haloasis A1 Holographic Lyrics Speaker',
  '拿火精灵无弦吉他': 'Nafire Spirit Air Guitar',
  'Aeroband空气乐队 吉他 架子鼓': 'Aeroband PocketGuitar & Air Drum Kit',
  'Aeroband智能空气架子鼓': 'Aeroband Smart Air Drum Kit',
  '音乐密码自动挡钢琴-全家福': 'Music Code Auto Piano (Family Edition)',
  'OXS傲希 Thunder Pro+影院级全景声桌面电竞音响': 'OXS Thunder Pro+ Gaming Spatial Audio Speaker',
  '惊奇屋wunderkammer便携音乐创造器': 'Wunderkammer Portable Music Creator',
  '极哲 zip三折叠投影仪': 'Jizhe Zip Tri-Fold Projector',
  '【新品预售】音乐密码2自动挡便携弹唱钢琴电子琴音箱智能键盘': 'Music Code 2 Portable Auto Piano',
  'Musspark AI随弹吉他S1 mini': 'Musspark AI Guitar S1 Mini',
  'LAVA STUDIO超能音乐工作站': 'LAVA STUDIO Super Music Workstation',

  // AI Hardware
  'Ringconn Gen 3': 'RingConn Gen 3 Smart Ring',
  'IKKO首发礼包仅限前300订单到店自提': 'iKKO Launch Bundle (First 300 In-Store)',
  'Ring Conn智能戒指': 'RingConn Smart Ring',
  'iKKO MindOne 卡片AI手机': 'iKKO MindOne AI Card Phone',
  'Plaud Note AI纪要产品': 'Plaud Note AI Voice Recorder',
  '音诺InnAIO Type-C 磁吸翻译机T10': 'InnAIO T10 MagSafe AI Translator',
  'Plaudnote Pro': 'Plaud Note Pro',

  // Photography
  'PGYTECH RetroVa 复古影像套装 复古影像2X长焦套装 全能大师套装PGY': 'PGYTECH RetroVa Vintage Imaging Kit',
  '影石Insta Ace Pro 2  标准套餐': 'Insta360 Ace Pro 2',
  '哈浮 HOVER运动飞行相机': 'HOVER Air X1 Smart Flying Camera',
  '极印口袋照片打印机': 'Jiyin Pocket Photo Printer',
  '极印照片打印机N2': 'Jiyin Photo Printer N2',
  'DWARF液压云台三脚架': 'DWARF Hydraulic Pan-Tilt Tripod',
  'DWARF 3智能望远镜': 'DWARF 3 Smart Telescope',
  'DWARF 3智能天文望远镜': 'DWARF 3 Smart Astronomy Telescope',

  // Smart Home (Steelcase)
  'Steelcase 世楷 Migration SE Pro升降桌': 'Steelcase Migration SE Pro Height-Adjustable Desk',
  'Steelcase 世楷 Karman 人体工学椅': 'Steelcase Karman Ergonomic Chair',
  'Steelcase 世楷 Leap 人体工学椅': 'Steelcase Leap Ergonomic Chair',
  'Steelcase 世楷 Think 人体工学椅': 'Steelcase Think Ergonomic Chair',
  'Steelcase 世楷 Gesture 人体工学椅': 'Steelcase Gesture Ergonomic Chair',
  'Steelcase 世楷 Series 2 人体工学椅': 'Steelcase Series 2 Ergonomic Chair',
  'Steelcase 世楷  Series 1 人体工学椅': 'Steelcase Series 1 Ergonomic Chair',

  // Outdoor
  'HyperShell极壳户外山地外骨骼 X Ultra': 'HyperShell X Ultra Outdoor Exoskeleton',
  'HyperShell极壳户外山地外骨骼 X Pro': 'HyperShell X Pro Outdoor Exoskeleton',
  '云杉高能 户外迷你充气泵 高速风扇': 'Yunshan Outdoor Mini Air Pump & Fan',
  'TINY SHOWER 淋浴器': 'TINY SHOWER Portable Shower',
  'MAX PUMP 3 赛博泵': 'MAX PUMP 3 Cyber Pump',
  'TINY TIRE PUMP ACS 微型轮胎泵': 'TINY TIRE PUMP ACS Micro Tire Pump',
  'OneGo Pocket 单肩包': 'PGYTECH OneGo Pocket Sling Bag',
  'PGYTECH OnePro Ultralight  双肩摄影包PGY': 'PGYTECH OnePro Ultralight Backpack',
  'PGYTECH CFexpress闪传卡盒 PGY': 'PGYTECH CFexpress Card Case',
  'PGYTECH闪传卡盒PGY': 'PGYTECH Card Case',
  'PGYTECH OneGo Lite 双肩摄影包 PGY': 'PGYTECH OneGo Lite Backpack',
  'PGYTECH OneGo抽绳包PGY': 'PGYTECH OneGo Rope Strap Bag',
  'PGYTECH OneGo 束口包PGY': 'PGYTECH OneGo Drawstring Bag',
  'PGYTECH LinkGo手机摄影背带 编绳款PGY': 'PGYTECH LinkGo Phone Strap (Braided)',
  ' LinkGo手机摄影背带 织带': 'PGYTECH LinkGo Phone Strap (Woven)',
  'PGYTECH MagFlex手机摄影支架PGY': 'PGYTECH MagFlex Phone Mount',
  'MagGlow手机磁吸补光灯': 'PGYTECH MagGlow MagSafe Fill Light',
  'PGYTECH MagCam2手机摄影手柄PGY': 'PGYTECH MagCam 2 Phone Grip',

  // Desktop Robots
  'Walulu智能AI毛绒仿生器人': 'Walulu AI Plush Companion Robot',
  '元萝卜AI下棋机器人四合一启蒙版': 'ChessUp AI Chess Robot (4-in-1 Starter)',
  'ropet AI陪伴型智能机器人': 'Ropet AI Companion Robot',
  'Ivy二代植物萌宠机器人': 'Ivy Gen 2 Plant Pet Robot',
  'LOOI机器人 DeepSeek大模型中英文语音对话视觉识别 MagSafe无线充电 智能仿生桌面陪伴手机机器人': 'LOOI Robot with DeepSeek AI',
  'Fuzozo芙崽智能Ai情感陪伴机器人毛绒玩具礼物': 'Fuzozo AI Emotional Companion Robot',
  '奇妙拉比 雷格斯-AI对话机器人': 'Curious Rabbit Regus AI Chat Robot',

  // AR/VR
  'VITURE Luma XR/AR智能眼镜': 'VITURE Luma XR/AR Smart Glasses',
  'ROKID AR Lite智能眼镜 AR眼镜': 'Rokid AR Lite Smart AR Glasses',
  'ROKID Glasses乐奇智能眼镜 AI眼镜': 'Rokid Glasses AI Smart Glasses',

  // Home Appliances
  'Babycare Lite 电动行李箱': 'Babycare Lite Electric Riding Luggage',

  // Lifestyle
  '小佩智能全自动猫厕所 ULTRA，白色': 'PETKIT Auto-Clean Cat Litter Box ULTRA',
  '小佩智能喂食器（可视版），白色': 'PETKIT Smart Camera Pet Feeder',
  '小佩宠物智能饮水机MAX，真无线': 'PETKIT Eversweet MAX Smart Water Fountain',
};

// Add English names to products
let matched = 0;
const updated = products.map(p => {
  const enName = EN_NAMES[p.name.trim()] || EN_NAMES[p.name] || null;
  if (enName) matched++;
  return { ...p, nameEn: enName || p.name }; // fallback to original if no mapping
});

console.log(`Matched: ${matched}/${products.length}`);

// Show unmatched
updated.filter(p => p.nameEn === p.name).forEach(p => {
  console.log('  UNMATCHED:', JSON.stringify(p.name));
});

fs.writeFileSync('./data/deduped-products.json', JSON.stringify(updated, null, 2));
console.log('\nSaved with English names!');
