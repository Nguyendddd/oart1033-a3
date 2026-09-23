let fontBeauty2;

let imgMaleHead, imgMaleUpperBody, imgMaleLowerBody;
let imgMaleUpperArm, imgMaleLowerArmOuter, imgMaleLowerArmWithin, imgMaleLeg;

let imgFemaleHead, imgFemaleUpperBody, imgFemaleLowerBody;
let imgFemaleUpperArm, imgFemaleLowerArmOuter, imgFemaleLowerArmInner, imgFemaleLeg;

let imgBg, imgBranches, imgBridge, imgCurtain;

let imgBgStage, imgMountains2, imgBigMountains2, imgDecor2, imgGrass2;

let imgChair3, imgChair23, imgCloset3, imgFloor3, imgLamp3, imgPicture3, imgTable3;

let imgStageFrame;

let video, handPose, hands = [];
let puppets = [];

const VIDEO_W = 640;
const VIDEO_H = 480;

let userInteractedInStage1 = false;
let stage1LoveSparks = [];

let drumClickedOnce = false;

let stage3PostDestructionTimer = 0;
const POST_DESTRUCTION_WAIT = 280; 
let isFinaleCurtainClosed = false;

let curtainState = "CLOSED_HOLD"; 
let curtainProgress = 1.0; 
let curtainTimer = 0;
let nextStageTarget = null;
let currentStage = 1;

const CURTAIN_DROP_SPEED = 0.025;
const CURTAIN_LIFT_SPEED = 0.014;
const CURTAIN_HOLD_DUR = 750;

const STAGE_POEMS = {
  1: [
    "Two souls, once strangers,",
    "met beneath the same moon.",
    "From one glance came a lifetime,",
    "and from one touch, a thread was born."
  ],
  2: [
    "The thread grew long,",
    "the thread grew tight.",
    "What once bound two hearts",
    "now bound their lives."
  ],
  3: [
    "They built a home from love,",
    "and a cage from the same thread.",
    "To set each other free,",
    "they must tear it all apart."
  ]
};

let floatingWhispers = [];

const STAGE2_STATE2_WHISPERS = [
  "I love you so, so much...",
  "I gave you my whole world.",
  "We were supposed to be one.",
  "Why is the thread feeling cold?",
  "Please don't drift away from me...",
  "Everything I do is for us.",
  "Hold onto me a little tighter.",
  "Don't let us fade."
];

const STAGE2_STATE3_WHISPERS = [
  "I need you, I can't live without you.",
  "You're not going anywhere!",
  "What about the fucking kids?!",
  "You did this to me.",
  "You ruined me...",
  "TAKE RESPONSIBILITY!",
  "Look at what you've done to us!",
  "How could you leave me like this?!",
  "You promised me forever!",
  "I gave up everything for you!",
  "You don't get to just walk away!",
  "LOOK AT ME!",
  "You're tearing our family apart!",
  "Take responsibility for me!"
];

function spawnHauntingWhisper(textList, isBrutal = false) {
  let txt = random(textList);
  floatingWhispers.push({
    text: txt,
    x: isBrutal ? random(width * 0.10, width * 0.90) : random(width * 0.16, width * 0.84),
    y: isBrutal ? random(height * 0.20, height * 0.78) : random(height * 0.24, height * 0.72),
    vx: isBrutal ? random(-0.4, 0.4) : random(-0.5, 0.5),
    vy: isBrutal ? random(-0.8, -0.3) : random(-1.0, -0.4),
    alpha: 255,
    life: 1.0,
    decay: isBrutal ? 0.008 : 0.006,
    size: isBrutal ? random(56, 72) : random(42, 54),
    shake: isBrutal ? random(1, 2.5) : 0,
    brutal: isBrutal
  });
}

let stage1EmbraceTimer = 0;    
const EMBRACE_PLAY_TIME = 360;  

let isAutoFlying = false;
let flightProgress = 0.0;
let flightStartX1 = 0, flightStartX2 = 0;
let hugProgress = 0.0;

const HUG_CONFIG = {
  triggerDistance: 480,
  releaseDistance: 580,
  flightSpeed: 0.009,
  peakLift: 80
};

const FINAL_HUG_POSE = {
  bodyOffset: 50,
  headTilt: 6,
  heightOffset: 0,
  inHandYOffset: -18,
  inHandGap: 4,
  inElbowYOffset: -2,
  male:   { handXOffset: -30, handYOffset: -120, elbowXOffset: -24, elbowYOffset: -50, armAngle: 80 },
  female: { handXOffset: 12,  handYOffset: -115, elbowXOffset: 24,  elbowYOffset: -45, armAngle: -90 }
};

let stage2Progress = 0.0;
let drumPulse = 0;
let walkStepProgress = 0.0;
let worldScrollX = 0;
let worldScrollTarget = 0;

const STAGE2_GROUND_Y_RATIO = 0.81;

const S2_CLASP_BEND_DEG = 34;
const S2_CLASP_LIFT = 1;
const S2_CLASP_ELBOW_LEFT = 1;

const S3_DROP = 98;

let stage2Tired = 0;
let stage2RopeStore = {};
let stage2LastFrame = -100;
let stage2Phase = 0;
let stage2ClaspBend = 0;
let s2EnteredState2Jump = false;
let s2EnteredState3 = false;

let blackoutTimer = 0;
const BLACKOUT_DURATION = 55;
let pendingJumpTrigger = null;

let camShakeX = 0;
let camShakeY = 0;
let camZoom = 1.0;
let targetZoom = 1.0;
let screenFlashAlpha = 0;
let screenFlashColor = [18, 4, 8];
let ashParticles = [];
let generativeSilkDust = [];
let generativeDesaturation = 0;
let generativeContrastGlitch = 1.0;

const S2_LINKS = [
  ['m.rHand',     'f.rHand',     0.10,  0,  0, false],
  ['m.upperBody', 'f.upperBody', 0.15, -6, -6, true ],
  ['m.lowerBody', 'f.lowerBody', 0.18,  4,  4, false],
  ['m.shoulder',  'f.shoulder',  0.14,  0,  0, true ],
  ['m.rElbow',    'f.rElbow',    0.20,  0,  0, false],
  ['m.upperBody', 'f.lowerBody', 0.12,  6, -4, true ],
  ['m.lowerBody', 'f.upperBody', 0.22, -4,  6, false],
  ['m.shoulder',  'f.head',      0.08, -4,  0, true ],
  ['m.lowerBody', 'f.lFoot',     0.24,  8, -2, false],
  ['m.rHand',     'f.lowerBody', 0.06,  0,  6, true ],
  ['m.upperBody', 'f.rHand',     0.05,  0,  0, true ],
  ['m.head',      'f.head',      0.12,  0,  0, false]
];

function s2Node(m, f, key) {
  return (key[0] === 'm' ? m : f).nodes[key.slice(2)];
}

function distToSegment(px, py, x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  let l2 = dx * dx + dy * dy;
  if (l2 === 0) return dist(px, py, x1, y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / l2;
  t = constrain(t, 0, 1);
  return dist(px, py, x1 + t * dx, y1 + t * dy);
}

function propagateGlobalImpulse(hitX, hitY, impulseX, impulseY) {
  const RADIUS = Math.max(width, height);
  for (let puppet of puppets) {
    for (let n of puppet.nodesList) {
      let d = dist(hitX, hitY, n.x, n.y) + 40;
      let falloff = constrain(1 - d / RADIUS, 0.08, 1) * 0.18;
      n.x += impulseX * falloff;
      n.y += impulseY * falloff;
    }
  }
  for (let rope of stage3Ropes) {
    if (rope.severed) continue;
    for (let p of rope.pts) {
      let d = dist(hitX, hitY, p.x, p.y) + 40;
      let falloff = constrain(1 - d / RADIUS, 0.05, 1) * 0.12;
      p.x += impulseX * falloff;
      p.y += impulseY * falloff;
    }
  }
}

let bladeTrail = [];
let slashSparks = [];
let fallingParts = [];
let stage3Ropes = [];
let stage3Props = [];
let totalSlashesCount = 0;
let stage3SubtitleAlpha = 0;
let stage3TotalDestructionTriggered = false;

class Stage3PhysicsRope {
  constructor(mNode, fNode, segments = 10, seed = 0) {
    this.mNode = mNode;
    this.fNode = fNode;
    this.segments = segments;
    this.severed = false;
    this.hits = 0;
    this.maxHits = 8;
    this.seed = seed;
    this.pts = [];

    for (let i = 0; i < segments; i++) {
      let u = i / (segments - 1);
      let x = lerp(mNode.x, fNode.x, u);
      let y = lerp(mNode.y, fNode.y, u);
      this.pts.push({ x: x, y: y, ox: x, oy: y });
    }
  }

  update(slashSeg) {
    if (this.severed) return;

    this.pts[0].x = this.mNode.x;
    this.pts[0].y = this.mNode.y;
    this.pts[this.segments - 1].x = this.fNode.x;
    this.pts[this.segments - 1].y = this.fNode.y;

    for (let i = 1; i < this.segments - 1; i++) {
      let p = this.pts[i];
      let vx = (p.x - p.ox) * 0.94;
      let vy = (p.y - p.oy) * 0.94;
      p.ox = p.x;
      p.oy = p.y;
      p.x += vx;
      p.y += vy + 0.18;
    }

    let dTotal = dist(this.mNode.x, this.mNode.y, this.fNode.x, this.fNode.y);
    let targetSeg = (dTotal * 1.01) / (this.segments - 1);

    for (let iter = 0; iter < 7; iter++) {
      this.pts[0].x = this.mNode.x;
      this.pts[0].y = this.mNode.y;
      this.pts[this.segments - 1].x = this.fNode.x;
      this.pts[this.segments - 1].y = this.fNode.y;

      for (let i = 0; i < this.segments - 1; i++) {
        let p1 = this.pts[i];
        let p2 = this.pts[i + 1];
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        let d = Math.sqrt(dx * dx + dy * dy) || 0.0001;
        let diff = (d - targetSeg) / d;

        let w1 = (i === 0) ? 0 : 0.5;
        let w2 = (i + 1 === this.segments - 1) ? 0 : 0.5;

        p1.x += dx * diff * w1;
        p1.y += dy * diff * w1;
        p2.x -= dx * diff * w2;
        p2.y -= dy * diff * w2;
      }
    }

    if (slashSeg) {
      for (let i = 0; i < this.segments - 1; i++) {
        let hit = lineIntersect(slashSeg.x1, slashSeg.y1, slashSeg.x2, slashSeg.y2, this.pts[i].x, this.pts[i].y, this.pts[i + 1].x, this.pts[i + 1].y);
        if (hit) {
          let impulseX = (slashSeg.x2 - slashSeg.x1) * 0.45;
          let impulseY = (slashSeg.y2 - slashSeg.y1) * 0.45;
          this.pts[i].x += impulseX;
          this.pts[i].y += impulseY;
          this.mNode.x += impulseX * 0.16;
          this.mNode.y += impulseY * 0.10;
          this.fNode.x += impulseX * 0.16;
          this.fNode.y += impulseY * 0.10;
          propagateGlobalImpulse(hit.x, hit.y, impulseX, impulseY);

          this.hits++;
          camShakeY = 4.5;
          camShakeX = random(-3, 3);

          for (let k = 0; k < 12; k++) {
            slashSparks.push({
              x: hit.x, y: hit.y,
              vx: random(-5, 5), vy: random(-6, 2),
              sz: random(2, 4.5),
              r: 215, g: random(20, 45), b: random(25, 45),
              alpha: 255
            });
          }

          if (this.hits >= this.maxHits) {
            this.severed = true;
            this.mNode.x -= 18;
            this.fNode.x += 18;

            targetZoom = 1.04;
            screenFlashAlpha = 110;
            screenFlashColor = [15, 3, 5];

            generativeDesaturation = random(0.3, 0.7);
            generativeContrastGlitch = random(1.15, 1.45);

            for (let k = 0; k < 7; k++) {
              generativeSilkDust.push({
                x: hit.x, y: hit.y,
                vx: random(-2.5, 2.5), vy: random(-4, -1.5),
                seed: random(100),
                life: 1.0, decay: random(0.012, 0.022),
                len: random(18, 42),
                r: 165, g: random(15, 30), b: random(25, 35)
              });
            }
          }
          break;
        }
      }
    }
  }

  display() {
    if (this.severed) return;

    let ax = this.pts[0].x, ay = this.pts[0].y;
    let bx = this.pts[this.segments - 1].x, by = this.pts[this.segments - 1].y;
    let cdx = bx - ax, cdy = by - ay, cl = Math.sqrt(cdx * cdx + cdy * cdy) || 1;
    let nx = -cdy / cl, ny = cdx / cl;

    let strain = 0.85;
    let tv = frameCount * 1.4 + this.seed * 3.1;
    let vib = 0.95 * strain;

    const path = this.pts.map((p, i) => {
      const u = i / (this.segments - 1);
      const off = vib * (sin(PI * u) * cos(tv) + 0.35 * sin(TWO_PI * u) * cos(tv * 1.5 + 1));
      return { x: p.x + nx * off, y: p.y + ny * off };
    });

    push();
    noFill();
    strokeCap(ROUND); strokeJoin(ROUND);

    stroke(18, 2, 6, 95);
    strokeWeight(3.4);
    s2DrawSpline(path, 2.5);

    stroke(245, 18, 38, 250);
    strokeWeight(2.0);
    s2DrawSpline(path, 0);

    stroke(255, 65, 75, 210);
    strokeWeight(1.0);
    s2DrawSpline(path, -0.4);

    stroke(255, 220, 150, 180);
    strokeWeight(0.65);
    s2DrawSpline(path, -0.8);

    noStroke();
    fill(210, 20, 35, 240);
    circle(path[0].x, path[0].y, 4.5);
    circle(path[this.segments - 1].x, path[this.segments - 1].y, 4.5);
    pop();
  }
}

function triggerStage3TotalDestruction() {
  if (stage3TotalDestructionTriggered) return;
  stage3TotalDestructionTriggered = true;

  camShakeY = 16;
  camShakeX = random(-8, 8);
  targetZoom = 1.12;
  screenFlashAlpha = 240;
  screenFlashColor = [20, 4, 8];
  generativeDesaturation = 0.85;
  generativeContrastGlitch = 1.6;

  for (let puppet of puppets) {
    let allParts = [
      { name: 'head',          node: puppet.nodes.head,          img: puppet === puppets[0] ? imgMaleHead : imgFemaleHead },
      { name: 'upperBody',     node: puppet.nodes.upperBody,     img: puppet === puppets[0] ? imgMaleUpperBody : imgFemaleUpperBody },
      { name: 'lowerBody',     node: puppet.nodes.lowerBody,     img: puppet === puppets[0] ? imgMaleLowerBody : imgFemaleLowerBody },
      { name: 'frontLowerArm', node: puppet.nodes.rHand,         img: puppet === puppets[0] ? imgMaleLowerArmOuter : imgFemaleLowerArmOuter },
      { name: 'frontUpperArm', node: puppet.nodes.rElbow,        img: puppet === puppets[0] ? imgMaleUpperArm : imgFemaleUpperArm },
      { name: 'backLowerArm',  node: puppet.nodes.lHand,         img: puppet === puppets[0] ? imgMaleLowerArmWithin : imgFemaleLowerArmInner },
      { name: 'backUpperArm',  node: puppet.nodes.lElbow,        img: puppet === puppets[0] ? imgMaleUpperArm : imgFemaleUpperArm },
      { name: 'lLeg',          node: puppet.nodes.lFoot,         img: puppet === puppets[0] ? imgMaleLeg : imgFemaleLeg },
      { name: 'rLeg',          node: puppet.nodes.rFoot,         img: puppet === puppets[0] ? imgMaleLeg : imgFemaleLeg }
    ];

    for (let part of allParts) {
      if (!puppet.severed[part.name]) {
        puppet.severed[part.name] = true;
        fallingParts.push({
          img: part.img,
          x: part.node.x,
          y: part.node.y,
          vx: random(-7, 7),
          vy: -random(5, 12),
          rot: random(-0.5, 0.5),
          vrot: random(-0.15, 0.15),
          scaleVal: puppet.scaleVal,
          flip: puppet === puppets[0] ? -1 : 1,
          groundHitCount: 0
        });
      }
    }
  }

  for (let prop of stage3Props) {
    prop.hits = prop.maxHits;
    if (!prop.splitPhysics) {
      prop.splitPhysics = {
        left:  { offX: 0, offY: 0, vx: random(-5.0, -8.0), vy: random(3.0, 6.0), rot: 0, vrot: random(-0.04, -0.08) },
        right: { offX: 0, offY: 0, vx: random(5.0, 8.0),    vy: random(3.0, 6.0), rot: 0, vrot: random(0.04, 0.08) }
      };
    }
  }

  for (let k = 0; k < 70; k++) {
    slashSparks.push({
      x: random(width * 0.2, width * 0.8),
      y: random(height * 0.2, height * 0.8),
      vx: random(-8, 8), vy: random(-10, 4),
      sz: random(3, 7),
      r: 180, g: random(10, 30), b: random(15, 30),
      alpha: 255
    });
  }
}

function initStage3World() {
  stage3TotalDestructionTriggered = false;
  stage3PostDestructionTimer = 0;
  isFinaleCurtainClosed = false;

  stage3Props = [
    { key: 'picture', img: imgPicture3, hits: 0, maxHits: 4,  xRatio: 0.50, yRatio: 0.32, radius: 150, cooldown: 0, splitPhysics: null },
    { key: 'closet',  img: imgCloset3,  hits: 0, maxHits: 5,  xRatio: 0.82, yRatio: 0.62, radius: 170, cooldown: 0, splitPhysics: null },
    { key: 'lamp',    img: imgLamp3,    hits: 0, maxHits: 3,  xRatio: 0.34, yRatio: 0.28, radius: 130, cooldown: 0, splitPhysics: null },
    { key: 'chair',   img: imgChair3,   hits: 0, maxHits: 4,  xRatio: 0.20, yRatio: 0.70, radius: 130, cooldown: 0, splitPhysics: null },
    { key: 'chair2',  img: imgChair23,  hits: 0, maxHits: 4,  xRatio: 0.80, yRatio: 0.70, radius: 130, cooldown: 0, splitPhysics: null },
    { key: 'table',   img: imgTable3,   hits: 0, maxHits: 5,  xRatio: 0.50, yRatio: 0.74, radius: 160, cooldown: 0, splitPhysics: null }
  ];

  bladeTrail = [];
  slashSparks = [];
  fallingParts = [];
  generativeSilkDust = [];
  totalSlashesCount = 0;
  stage3SubtitleAlpha = 0;
  generativeDesaturation = 0;
  generativeContrastGlitch = 1.0;

  for (let p of puppets) {
    p.severed = {
      head: false, upperBody: false, lowerBody: false,
      frontLowerArm: false, frontUpperArm: false,
      backLowerArm: false, backUpperArm: false, lLeg: false, rLeg: false
    };
    p.hitCounts = { head: 0, upperBody: 0, lowerBody: 0, frontLowerArm: 0, backLowerArm: 0, lLeg: 0, rLeg: 0 };
    p.partCooldown = 0;
  }

  let sc = 0.8;
  let gY = height * STAGE2_GROUND_Y_RATIO;
  let floorY = gY - 330 * sc;

  puppets[0].restX = width * 0.40;
  puppets[1].restX = width * 0.60;

  for (let key in puppets[0].ctrls) {
    puppets[0].ctrls[key].x = puppets[0].restX;
    puppets[0].ctrls[key].y = floorY;
  }
  for (let key in puppets[1].ctrls) {
    puppets[1].ctrls[key].x = puppets[1].restX;
    puppets[1].ctrls[key].y = floorY;
  }

  for (let p of puppets) {
    for (let n of p.nodesList) { n.x = p.restX; n.y = gY - 42; n.oldX = n.x; n.oldY = n.y; }
  }

  stage3Ropes = [
    new Stage3PhysicsRope(puppets[0].nodes.head, puppets[1].nodes.head, 10, 0),
    new Stage3PhysicsRope(puppets[0].nodes.shoulder, puppets[1].nodes.shoulder, 10, 1),
    new Stage3PhysicsRope(puppets[0].nodes.upperBody, puppets[1].nodes.upperBody, 10, 2),
    new Stage3PhysicsRope(puppets[0].nodes.rHand, puppets[1].nodes.rHand, 8, 3),
    new Stage3PhysicsRope(puppets[0].nodes.lHand, puppets[1].nodes.lHand, 8, 4),
    new Stage3PhysicsRope(puppets[0].nodes.lowerBody, puppets[1].nodes.lowerBody, 10, 5),
    new Stage3PhysicsRope(puppets[0].nodes.rElbow, puppets[1].nodes.lElbow, 9, 6),
    new Stage3PhysicsRope(puppets[0].nodes.rHand, puppets[1].nodes.lFoot, 10, 7),
    new Stage3PhysicsRope(puppets[0].nodes.lFoot, puppets[1].nodes.rHand, 10, 8),
    new Stage3PhysicsRope(puppets[0].nodes.head, puppets[1].nodes.lowerBody, 11, 9),
    new Stage3PhysicsRope(puppets[0].nodes.lowerBody, puppets[1].nodes.head, 11, 10),
    new Stage3PhysicsRope(puppets[0].nodes.lElbow, puppets[1].nodes.rElbow, 9, 11),
    new Stage3PhysicsRope(puppets[0].nodes.rFoot, puppets[1].nodes.lHand, 10, 12),
    new Stage3PhysicsRope(puppets[0].nodes.shoulder, puppets[1].nodes.lowerBody, 10, 13)
  ];
}

function lineIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  let denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (denom === 0) return null;
  let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
  let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
  if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
    return { x: x1 + ua * (x2 - x1), y: y1 + ub * (y2 - y1) };
  }
  return null;
}

function updateAndRenderMasterCurtain() {
  if (curtainState === "CLOSING") {
    curtainProgress = min(1.0, curtainProgress + CURTAIN_DROP_SPEED);
    if (curtainProgress >= 1.0) {
      curtainState = "CLOSED_HOLD";
      curtainTimer = 0;
      if (nextStageTarget !== null) {
        setupNewStage(nextStageTarget);
        nextStageTarget = null;
      }
    }
  } else if (curtainState === "CLOSED_HOLD") {
    curtainTimer++;
    if (!isFinaleCurtainClosed && curtainTimer > CURTAIN_HOLD_DUR) {
      curtainState = "OPENING";
    }
  } else if (curtainState === "OPENING") {
    curtainProgress = max(0.0, curtainProgress - CURTAIN_LIFT_SPEED);
    if (curtainProgress <= 0.0) {
      curtainState = "IDLE";
    }
  }

  if (curtainProgress <= 0.001) return;

  push();
  let curtainH = height * 1.5;
  let easeP = curtainProgress * curtainProgress * (3 - 2 * curtainProgress);
  let curtainY = lerp(-(curtainH + 60), 0, easeP);

  tint(255);
  if (imgCurtain) {
    image(imgCurtain, -10, curtainY - 10, width + 20, curtainH);
  } else {
    fill(18, 6, 10);
    rect(0, curtainY, width, curtainH);
  }
  noTint();

  if (isFinaleCurtainClosed && curtainProgress >= 0.98) {
    push();
    textAlign(CENTER, CENTER);
    if (fontBeauty2) textFont(fontBeauty2);
    else textFont("Georgia");

    let poeticSize = constrain(width * 0.09, 80, 120);
    textSize(poeticSize);

    let words = ["The", "End"];
    let totalWidth = textWidth("The End");
    let startX = width * 0.5 - totalWidth / 2;
    let currentX = startX;
    const WORD_STAGGER = 22;
    const FLY_DURATION = 45;
    let ty = height * 0.44;

    for (let w = 0; w < words.length; w++) {
      let word = words[w];
      let wordStart = 20 + w * WORD_STAGGER;
      let wordEnd = wordStart + FLY_DURATION;
      let t = map(curtainTimer, wordStart, wordEnd, 0, 1, true);
      let ease = t * t * (3 - 2 * t);
      let alpha = 255 * ease;
      let flyInOffset = lerp(22, 0, ease);
      let wy = ty + flyInOffset;
      let wCenterX = currentX + textWidth(word) / 2;

      if (alpha > 0.5) {
        fill(10, 2, 4, alpha * 0.95);
        text(word, wCenterX + 3, wy + 3);

        drawingContext.shadowColor = `rgba(255, 65, 0, ${0.90 * ease})`;
        drawingContext.shadowBlur = 60;
        fill(255, 120, 10, alpha);
        text(word, wCenterX, wy);

        drawingContext.shadowColor = `rgba(255, 120, 0, ${0.95 * ease})`;
        drawingContext.shadowBlur = 25;
        fill(255, 220, 130, alpha);
        text(word, wCenterX, wy);

        drawingContext.shadowBlur = 0;
      }
      currentX += textWidth(word + " ");
    }
    pop();
    return;
  }

  let lines = STAGE_POEMS[currentStage] || [];
  if (lines.length > 0 && curtainProgress > 0.85) {
    let globalFadeOut = map(curtainTimer, CURTAIN_HOLD_DUR - 80, CURTAIN_HOLD_DUR - 10, 1, 0, true);

    if (globalFadeOut > 0.01) {
      push();
      textAlign(LEFT, CENTER);
      if (fontBeauty2) textFont(fontBeauty2);
      else textFont("Georgia");
      
      let poeticSize = constrain(width * 0.062, 58, 88);
      textSize(poeticSize);

      let lineHeight = poeticSize * 1.45;
      let totalH = (lines.length - 1) * lineHeight;
      let baseY = height * 0.53 - totalH / 2;

      let globalWordCounter = 0;
      const WORD_STAGGER = 20; 
      const FLY_DURATION = 38; 

      for (let i = 0; i < lines.length; i++) {
        let words = lines[i].split(" ");
        let lineY = baseY + i * lineHeight;

        let totalLineWidth = textWidth(lines[i]);
        let startX = (width - totalLineWidth) * 0.5;
        let currentX = startX;

        for (let w = 0; w < words.length; w++) {
          let word = words[w];
          let wordStart = 35 + globalWordCounter * WORD_STAGGER;
          let wordEnd = wordStart + FLY_DURATION;
          globalWordCounter++;

          let t = map(curtainTimer, wordStart, wordEnd, 0, 1, true);
          let ease = t * t * (3 - 2 * t);

          let alpha = 255 * ease * globalFadeOut;
          if (alpha < 1) {
            currentX += textWidth(word + " ");
            continue;
          }

          let flyInOffset = lerp(22, 0, ease);
          let ty = lineY + flyInOffset;

          fill(10, 2, 4, alpha * 0.95);
          text(word, currentX + 3, ty + 3);

          drawingContext.shadowColor = `rgba(255, 65, 0, ${0.90 * ease})`;
          drawingContext.shadowBlur = 60;
          fill(255, 120, 10, alpha);
          text(word, currentX, ty);

          drawingContext.shadowColor = `rgba(255, 120, 0, ${0.95 * ease})`;
          drawingContext.shadowBlur = 25;
          fill(255, 220, 130, alpha);
          text(word, currentX, ty);

          drawingContext.shadowBlur = 0;
          currentX += textWidth(word + " ");
        }
      }
      pop();
    }
  }
  pop();
}

function startStageTransition(toStage) {
  if (curtainState === "CLOSING" || curtainState === "CLOSED_HOLD") return;
  nextStageTarget = toStage;
  curtainState = "CLOSING";
}

function setupNewStage(toStage) {
  currentStage = toStage;
  let gY = height * STAGE2_GROUND_Y_RATIO;
  let sc = 0.8;

  if (currentStage === 1) {
    userInteractedInStage1 = false;
    isAutoFlying = false;
    flightProgress = 0.0;
    hugProgress = 0.0;
    puppets[0].restX = width * 0.10;
    puppets[1].restX = width * 0.90;
    if (puppets[1] && puppets[1].baseNeutralHead !== undefined) {
      puppets[1].neutralHeadAngleDiff = puppets[1].baseNeutralHead;
    }
  } else if (currentStage === 2) {
    drumClickedOnce = false;
    puppets[0].restX = width * 0.53;
    puppets[1].restX = width * 0.45;

    for (let n of puppets[0].nodesList) { n.y = gY - 42; n.oldY = gY - 42; }
    for (let n of puppets[1].nodesList) { n.y = gY - 42; n.oldY = gY - 42; }

    puppets[0].armRot.frontLower = 0; puppets[0].armRot.frontUpper = 0;
    puppets[0].armRot.backLower = 0;  puppets[0].armRot.backUpper = 0;
    puppets[1].armRot.frontLower = 0; puppets[1].armRot.frontUpper = 0;
    puppets[1].armRot.backLower = 0;  puppets[1].armRot.backUpper = 0;

    let floorY = gY - 330 * sc;
    for (let puppet of puppets) {
      for (let key in puppet.ctrls) {
        puppet.ctrls[key].x = puppet.restX;
        puppet.ctrls[key].y = floorY;
      }
    }

    stage2Progress = 0.0;
    walkStepProgress = 0.0;
    worldScrollX = 0;
    worldScrollTarget = 0;
    stage2RopeStore = {};
    stage2Phase = 0;
    stage2ClaspBend = 0;
    stage2Tired = 0;
    s2EnteredState2Jump = false;
    s2EnteredState3 = false;
    blackoutTimer = 0;
    pendingJumpTrigger = null;
    camShakeX = 0;
    camShakeY = 0;
    floatingWhispers = [];
    if (puppets[1]) puppets[1].scaleVal = puppets[1].baseScaleVal;

  } else if (currentStage === 3) {
    floatingWhispers = [];
    initStage3World();
  }
}

function setDrivenNode(node, x, y) {
  node.x = x; node.y = y; node.oldX = x; node.oldY = y;
}

function softDriveTo(node, targetX, targetY, springFactor = 0.14, damping = 0.35) {
  if (targetX !== null && targetX !== undefined) {
    let vx = (targetX - node.x) * springFactor;
    node.x += vx;
    node.oldX = node.x - vx * damping;
  }
  if (targetY !== null && targetY !== undefined) {
    let vy = (targetY - node.y) * springFactor;
    node.y += vy;
    node.oldY = node.y - vy * damping;
  }
}

function solveArmIK(shoulder, tx, ty, len1, len2, elbowDown) {
  let dx = tx - shoulder.x, dy = ty - shoulder.y;
  let d = Math.sqrt(dx * dx + dy * dy) || 0.0001;
  let ux = dx / d, uy = dy / d;
  let reach = constrain(d, Math.abs(len1 - len2) + 1, (len1 + len2) * 0.985);
  let a = (len1 * len1 - len2 * len2 + reach * reach) / (2 * reach);
  let h = Math.sqrt(Math.max(0, len1 * len1 - a * a));
  let sign = ux >= 0 ? 1 : -1;
  if (!elbowDown) sign = -sign;
  return {
    hx: shoulder.x + ux * reach,
    hy: shoulder.y + uy * reach,
    ex: shoulder.x + ux * a - uy * sign * h,
    ey: shoulder.y + uy * a + ux * sign * h
  };
}

function s2RopeReset(r, ax, ay, bx, by, slack) {
  const N = r.pts.length;
  const sag = dist(ax, ay, bx, by) * 0.45 * max(slack, 0);
  for (let i = 0; i < N; i++) {
    const u = i / (N - 1), p = r.pts[i];
    p.x = p.ox = lerp(ax, bx, u);
    p.y = p.oy = lerp(ay, by, u) + sin(u * PI) * sag;
  }
}

function s2DrawSpline(path, dy) {
  beginShape();
  const len = path.length;
  curveVertex(path[0].x, path[0].y + dy);
  for (let i = 0; i < len; i++) curveVertex(path[i].x, path[i].y + dy);
  curveVertex(path[len - 1].x, path[len - 1].y + dy);
  endShape();
}

function stage2Rope(id, ax, ay, bx, by, slack, target, opt) {
  let r = stage2RopeStore[id];
  if (target === 0 && (!r || r.fade < 0.02)) return;

  opt = opt || {};
  const N = opt.segments || 10;
  if (!r) {
    r = stage2RopeStore[id] = { pts: [], fade: 0, seed: id * 1.7 };
    for (let i = 0; i < N; i++) r.pts.push({ x: ax, y: ay, ox: ax, oy: ay });
    s2RopeReset(r, ax, ay, bx, by, slack);
  }

  r.fade = lerp(r.fade, target, 0.08);
  if (r.fade < 0.02) {
    if (target === 0) s2RopeReset(r, ax, ay, bx, by, slack);
    return;
  }

  const pts = r.pts;
  const d = dist(ax, ay, bx, by);
  const rest = max(d * (1 + slack), 8);
  const seg = rest / (N - 1);
  const t = frameCount * 0.03 + r.seed;

  pts[0].x = ax; pts[0].y = ay;
  pts[N - 1].x = bx; pts[N - 1].y = by;

  for (let i = 1; i < N - 1; i++) {
    const p = pts[i];
    const vx = (p.x - p.ox) * 0.96;
    const vy = (p.y - p.oy) * 0.96;
    p.ox = p.x;
    p.oy = p.y;
    p.x += vx;
    p.y += vy + 0.55;
  }

  for (let it = 0; it < 5; it++) {
    pts[0].x = ax; pts[0].y = ay;
    pts[N - 1].x = bx; pts[N - 1].y = by;

    for (let i = 0; i < N - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      const dx = b.x - a.x, dy = b.y - a.y;
      const dd = Math.sqrt(dx * dx + dy * dy) || 0.0001;
      if (dd <= seg) continue;
      const diff = (dd - seg) / dd;
      const wa = i === 0 ? 0 : (i + 1 === N - 1 ? 1 : 0.5);
      const wb = i + 1 === N - 1 ? 0 : (i === 0 ? 1 : 0.5);
      a.x += dx * diff * wa; a.y += dy * diff * wa;
      b.x -= dx * diff * wb; b.y -= dy * diff * wb;
    }

    if (opt.floor !== undefined && ay <= opt.floor) {
      for (let i = 1; i < N - 1; i++) {
        if (pts[i].y > opt.floor) pts[i].y = opt.floor;
      }
    }
  }

  if (opt.floor !== undefined && ay <= opt.floor) {
    for (let i = 1; i < N - 1; i++) {
      const p = pts[i];
      if (p.y >= opt.floor - 0.01) { p.ox = p.x - (p.x - p.ox) * 0.45; p.oy = p.y; }
    }
  }

  const cdx = bx - ax, cdy = by - ay, cl = Math.sqrt(cdx * cdx + cdy * cdy) || 1;
  const nx = -cdy / cl, ny = cdx / cl;
  const tau = constrain(map(slack, 0.04, -0.006, 0, 1), 0, 1);
  const vib = tau * (0.35 + 1.8 * (drumPulse / 14) + (opt.strain || 0));
  const tv = frameCount * (0.5 + tau * 0.9) + r.seed * 3;

  const path = pts.map((p, i) => {
    const u = i / (N - 1);
    const off = vib * (sin(PI * u) * cos(tv) + 0.4 * sin(TWO_PI * u) * cos(tv * 1.6 + 1));
    return { x: p.x + nx * off, y: p.y + ny * off };
  });

  const f = r.fade;
  push();
  noFill(); strokeCap(ROUND); strokeJoin(ROUND);

  stroke(18, 2, 6, 75 * f);
  strokeWeight(3.4);
  s2DrawSpline(path, 2.5);

  stroke(245, 18, 38, 245 * f);
  strokeWeight(2.0 - tau * 0.4);
  s2DrawSpline(path, 0);

  stroke(255, 65, 75, 210 * f);
  strokeWeight(1.0);
  s2DrawSpline(path, -0.3);

  stroke(255, 220, 150, (80 + 140 * tau) * f);
  strokeWeight(0.6);
  s2DrawSpline(path, -0.7);

  noStroke();
  fill(210, 20, 35, 235 * f);
  circle(path[0].x, path[0].y, 4.8);
  circle(path[N - 1].x, path[N - 1].y, 4.8);
  pop();
}

function drawRepeatingLayer(img, scrollX, speed) {
  if (!img) return;
  let w = width, h = height;
  let offset = (scrollX * speed) % w;
  if (offset < 0) offset += w;
  image(img, -offset, 0, w + 1, h);
  image(img, -offset + w, 0, w + 1, h);
  if (-offset + w < width) image(img, -offset + 2 * w, 0, w + 1, h);
}

function handleStage2Kinematics(male, female) {
  if (!male || !female) return;

  if (frameCount - stage2LastFrame > 3) {
    stage2RopeStore = {};
    stage2Phase = 0;
    stage2ClaspBend = 0;
    stage2Tired = 0;
    s2EnteredState2Jump = false;
    s2EnteredState3 = false;
    blackoutTimer = 0;
    pendingJumpTrigger = null;
  }
  stage2LastFrame = frameCount;

  walkStepProgress = lerp(walkStepProgress, 0, 0.04);
  stage2Phase += walkStepProgress * 0.14;
  let p = stage2Progress;
  let strideAmt = walkStepProgress;
  let t = frameCount;
  let walkPhase = stage2Phase;

  if (female.baseNeutralHead === undefined) female.baseNeutralHead = female.neutralHeadAngleDiff;
  let headDroopAngle = 0;
  if (p >= 0.25 && p < 0.60) {
    headDroopAngle = map(p, 0.25, 0.60, 0.24, 0.46);
  }
  female.neutralHeadAngleDiff = female.baseNeutralHead + headDroopAngle;

  let groundY = height * STAGE2_GROUND_Y_RATIO;
  let maxStandHeight = groundY - 90;

  male.armRot.frontLower = 0; male.armRot.frontUpper = 0;
  male.armRot.backLower = 0;  male.armRot.backUpper = 0;
  female.armRot.frontUpper = 0; female.armRot.backLower = 0; female.armRot.backUpper = 0;

  stage2ClaspBend = lerp(stage2ClaspBend, p < 0.25 ? S2_CLASP_BEND_DEG : 0, 0.12);
  female.armRot.frontLower = stage2ClaspBend;

  male.restX = width * 0.53;
  let dragDist;

  if (p < 0.60) {
    female.scaleVal = female.baseScaleVal;
  } else {
    female.scaleVal = female.baseScaleVal * 1.11;
  }

  if (p < 0.25) {
    dragDist = 100;
  } else if (p < 0.60) {
    if (p < 0.45) {
      let stumbleT = map(p, 0.25, 0.45, 0, 1, true);
      dragDist = lerp(100, 215, stumbleT);
    } else {
      dragDist = constrain(male.nodes.lowerBody.x - 140, 260, 420);
      if (!s2EnteredState2Jump && (blackoutTimer > 0 || pendingJumpTrigger === 'state2')) {
        let targetJumpX = male.nodes.lowerBody.x - dragDist;
        let dx = targetJumpX - female.nodes.lowerBody.x;
        for (let n of female.nodesList) { n.x += dx; n.oldX = n.x; }
        s2EnteredState2Jump = true;
        pendingJumpTrigger = null;
      }
    }
  } else {
    let s3FarLeftX = max(width * 0.08, 75);
    dragDist = male.nodes.lowerBody.x - s3FarLeftX;
    if (!s2EnteredState3 && (blackoutTimer > 0 || pendingJumpTrigger === 'state3')) {
      let targetJumpX = male.nodes.lowerBody.x - dragDist;
      let dx = targetJumpX - female.nodes.lowerBody.x;
      let floorY = groundY + S3_DROP;
      for (let n of female.nodesList) { n.x += dx; n.oldX = n.x; n.y = floorY; n.oldY = n.y; }
      s2EnteredState3 = true;
      pendingJumpTrigger = null;
    }
  }

  female.restX = male.nodes.lowerBody.x - dragDist;
  softDriveTo(male.nodes.lowerBody, male.restX, null);
  male.nodes.lowerBody.y = max(male.nodes.lowerBody.y, maxStandHeight);

  let legSwingL = sin(walkPhase) * 20 * strideAmt;
  let legSwingR = -sin(walkPhase) * 20 * strideAmt;
  let liftL = max(0, -cos(walkPhase)) * 10 * strideAmt;
  let liftR = max(0, cos(walkPhase)) * 10 * strideAmt;
  setDrivenNode(male.nodes.lFoot, male.nodes.lowerBody.x - 16 + legSwingL, groundY + 10 - liftL);
  setDrivenNode(male.nodes.rFoot, male.nodes.lowerBody.x + 16 + legSwingR, groundY + 10 - liftR);

  let stepBounce = abs(sin(walkPhase)) * 4 * strideAmt;
  softDriveTo(male.nodes.lowerBody, null, groundY - 42 - stepBounce);

  let aggroLean = map(p, 0.0, 1.0, 4, 22);
  softDriveTo(male.nodes.upperBody, male.nodes.lowerBody.x + aggroLean, null);
  softDriveTo(male.nodes.head, male.nodes.upperBody.x + aggroLean * 0.6, null);

  setDrivenNode(male.nodes.lHand, male.nodes.shoulder.x + 4, groundY - 34);
  setDrivenNode(male.nodes.lElbow, male.nodes.shoulder.x + 2, lerp(male.nodes.shoulder.y, groundY - 34, 0.5));

  let claspX = (male.nodes.lowerBody.x + female.nodes.lowerBody.x) * 0.5 - 2;
  let claspY = groundY - 44;

  if (p < 0.25) {
    setDrivenNode(male.nodes.rHand, claspX + 2, claspY);
    setDrivenNode(male.nodes.rElbow, lerp(male.nodes.shoulder.x, claspX, 0.45) - 6, groundY - 72);
    setDrivenNode(female.nodes.rHand, claspX - 1, claspY - S2_CLASP_LIFT);
    setDrivenNode(female.nodes.rElbow, lerp(female.nodes.shoulder.x, claspX, 0.45) - 10 - S2_CLASP_ELBOW_LEFT, groundY - 68);
  } else if (p < 0.60) {
    let mSwingR = -sin(walkPhase) * 14 * strideAmt;
    softDriveTo(male.nodes.rHand, male.nodes.shoulder.x + 6 + mSwingR, groundY - 34, 0.2);
    softDriveTo(male.nodes.rElbow, male.nodes.shoulder.x + 4, lerp(male.nodes.shoulder.y, groundY - 34, 0.5), 0.2);
  }

  const FEMALE_STAND_DROP = 0;
  let femaleGroundStandY = groundY - 42 + FEMALE_STAND_DROP;

  if (p < 0.60) {
    softDriveTo(female.nodes.lowerBody, female.restX, null, 0.1);
    female.nodes.lowerBody.y = max(female.nodes.lowerBody.y, maxStandHeight + FEMALE_STAND_DROP);
  }

  if (p < 0.25) {
    let fPhase = walkPhase - 0.35;
    let fSwingL = sin(fPhase) * 14 * strideAmt, fSwingR = -sin(fPhase) * 14 * strideAmt;
    let fLiftL = max(0, -cos(fPhase)) * 6 * strideAmt, fLiftR = max(0, cos(fPhase)) * 6 * strideAmt;

    softDriveTo(female.nodes.lowerBody, null, femaleGroundStandY - abs(sin(fPhase)) * 2 * strideAmt);
    setDrivenNode(female.nodes.lFoot, female.nodes.lowerBody.x - 14 + fSwingL, groundY + 10 + FEMALE_STAND_DROP * 0.7 - fLiftL);
    setDrivenNode(female.nodes.rFoot, female.nodes.lowerBody.x + 14 + fSwingR, groundY + 10 + FEMALE_STAND_DROP * 0.7 - fLiftR);
    softDriveTo(female.nodes.upperBody, female.nodes.lowerBody.x, null);
    softDriveTo(female.nodes.head, female.nodes.upperBody.x, null);

    setDrivenNode(female.nodes.lHand, female.nodes.shoulder.x - 4, groundY - 26 + FEMALE_STAND_DROP);
    setDrivenNode(female.nodes.lElbow, female.nodes.shoulder.x - 2, lerp(female.nodes.shoulder.y, groundY - 26 + FEMALE_STAND_DROP, 0.5));

  } else if (p < 0.60) {
    let stumbleT = map(p, 0.25, 0.60, 0.0, 1.0, true);
    let stumbleStride = lerp(0.95, 0.45, stumbleT);
    let fPhase = walkPhase * 1.15 - 0.25 + noise(t * 0.04) * 0.35;
    let fSwingL = sin(fPhase) * 13 * strideAmt * stumbleStride;
    let fSwingR = -sin(fPhase) * 13 * strideAmt * stumbleStride;
    let fLiftL = max(0, -cos(fPhase)) * 5 * strideAmt * stumbleStride;
    let fLiftR = max(0, cos(fPhase)) * 5 * strideAmt * stumbleStride;

    let stumbleSagY = lerp(0, 16, stumbleT);
    softDriveTo(female.nodes.lowerBody, null, femaleGroundStandY + stumbleSagY - abs(sin(fPhase)) * 2 * strideAmt, 0.1);
    setDrivenNode(female.nodes.lFoot, female.nodes.lowerBody.x - 14 + fSwingL, groundY + 10 + FEMALE_STAND_DROP * 0.7 - fLiftL);
    setDrivenNode(female.nodes.rFoot, female.nodes.lowerBody.x + 14 + fSwingR, groundY + 10 + FEMALE_STAND_DROP * 0.7 - fLiftR);

    let strainForwardLean = lerp(4, 15, stumbleT);
    softDriveTo(female.nodes.upperBody, female.nodes.lowerBody.x + strainForwardLean, null, 0.12);

    let headHangX = female.nodes.upperBody.x + strainForwardLean * 0.6 + sin(headDroopAngle) * 8;
    let headHangY = female.nodes.upperBody.y - 18 + (1 - cos(headDroopAngle)) * 8;
    softDriveTo(female.nodes.head, headHangX, headHangY, 0.15);

    let armReachX = female.nodes.shoulder.x + lerp(12, 28, stumbleT) + sin(fPhase) * 5;
    let armReachY = groundY - lerp(26, 38, stumbleT) + FEMALE_STAND_DROP;
    softDriveTo(female.nodes.rHand, armReachX, armReachY, 0.22);
    softDriveTo(female.nodes.rElbow, lerp(female.nodes.shoulder.x, armReachX, 0.5) - 4, armReachY - 14, 0.22);

    let armBackY = groundY - lerp(26, 16, stumbleT) + FEMALE_STAND_DROP;
    softDriveTo(female.nodes.lHand, female.nodes.lowerBody.x - lerp(8, 18, stumbleT), armBackY, 0.2);
    softDriveTo(female.nodes.lElbow, female.nodes.shoulder.x - 6, lerp(female.nodes.shoulder.y, armBackY, 0.5), 0.2);

  } else {
    let floorY = groundY + S3_DROP;
    softDriveTo(female.nodes.lowerBody, female.restX, floorY, 0.25);

    let pullHandX = male.nodes.lowerBody.x - 18;
    let pullHandY = groundY - 38;
    softDriveTo(male.nodes.rHand, pullHandX, pullHandY, 0.18);
    softDriveTo(male.nodes.rElbow, lerp(male.nodes.shoulder.x, pullHandX, 0.5) - 6, groundY - 60, 0.18);

    let liftA = -0.06 - 0.03 * sin(t * 0.08);
    let headA = liftA - 0.72 - 0.14 * sin(t * 0.12 + 1);
    let lieUpperX = female.nodes.lowerBody.x + cos(liftA) * female.spineLength;
    let lieUpperY = female.nodes.lowerBody.y + sin(liftA) * female.spineLength + sin(t * 0.18) * 2;
    let lieHeadX = lieUpperX + cos(headA) * female.neckLength;
    let lieHeadY = lieUpperY + sin(headA) * female.neckLength;

    let targetHeadX = lieHeadX + female.headNodeShift.x;
    let targetHeadY = lieHeadY + female.headNodeShift.y;

    let poseSpring = 0.20;
    softDriveTo(female.nodes.upperBody, lieUpperX, lieUpperY, poseSpring);
    softDriveTo(female.nodes.head, targetHeadX, targetHeadY, poseSpring);
    softDriveTo(female.nodes.shoulder, female.nodes.upperBody.x, female.nodes.upperBody.y + 4, poseSpring);

    let kickL = 0.32 + 0.32 * (0.5 + 0.5 * sin(t * 0.31 + 1));
    let kickR = 0.22 + 0.28 * (0.5 + 0.5 * sin(t * 0.27 + 3));
    let lieLFootX = female.nodes.lowerBody.x - cos(kickL) * female.bones[8].length;
    let lieRFootX = female.nodes.lowerBody.x - cos(kickR) * female.bones[9].length;

    let clawA = sin(t * 0.45) * 0.45;
    let armReach = (female.bones[6].length + female.bones[7].length) * 0.92;
    let lieRX = female.nodes.shoulder.x + cos(0.30 + clawA) * (armReach * 0.88);
    let lieRY = female.nodes.shoulder.y + sin(0.30 + clawA) * (armReach * 0.88);
    let fr = solveArmIK(female.nodes.shoulder, lieRX, lieRY, female.bones[6].length, female.bones[7].length, true);

    let lieLX = female.nodes.upperBody.x + 38 + 24 * sin(t * 0.13);
    let bk = solveArmIK(female.nodes.shoulder, lieLX, floorY - 8, female.bones[4].length, female.bones[5].length, false);

    softDriveTo(female.nodes.lFoot, lieLFootX, floorY - 4, poseSpring);
    softDriveTo(female.nodes.rFoot, lieRFootX, floorY - 2, poseSpring);
    softDriveTo(female.nodes.rHand, fr.hx, fr.hy, poseSpring);
    softDriveTo(female.nodes.rElbow, fr.ex, fr.ey, poseSpring);
    softDriveTo(female.nodes.lHand, bk.hx, bk.hy, poseSpring);
    softDriveTo(female.nodes.lElbow, bk.ex, bk.ey, poseSpring);

    let strain = 2.4 * (0.3 + strideAmt * 0.6);
    female.nodes.lFoot.x  += sin(t * 0.45 + 1.0) * strain;
    female.nodes.lFoot.y  += cos(t * 0.4 + 2.0) * strain * 0.5;
    female.nodes.rFoot.x  += sin(t * 0.4 + 3.0) * strain;
    female.nodes.rFoot.y  += cos(t * 0.5 + 1.0) * strain * 0.5;
    female.nodes.rElbow.x += sin(t * 0.35) * strain * 0.45;
    female.nodes.rHand.x  += sin(t * 0.35 + 0.6) * strain * 0.3;
    female.nodes.lElbow.x += cos(t * 0.32) * strain * 0.45;
    female.nodes.lHand.x  += cos(t * 0.32 + 0.6) * strain * 0.3;
    female.nodes.head.x   += sin(t * 0.25) * strain * 0.4;
    female.nodes.head.y   += sin(t * 0.3) * strain * 0.3;

    if (random() < 0.28) {
      let twitch = (random() - 0.5) * 6.0;
      female.nodes.head.x += twitch;
      female.nodes.head.y += (random() - 0.5) * 4.0;
      female.nodes.rHand.y += (random() - 0.5) * 7.0;
    }
  }
}

function drawEntangledSilkNetwork(male, female) {
  const p = stage2Progress;
  const floorY = height * STAGE2_GROUND_Y_RATIO + (p >= 0.60 ? S3_DROP - 20 : 15);

  let activeCount = p < 0.25 ? 3 : (p < 0.45 ? 3 : (p < 0.60 ? 5 : 7));

  for (let i = 0; i < S2_LINKS.length; i++) {
    const L = S2_LINKS[i];
    const a = s2Node(male, female, L[0]);
    const b = s2Node(male, female, L[1]);
    const isTightLink = L[5];

    let slack;
    let strainVal = 0.2;

    if (p < 0.25) slack = L[2];
    else if (p < 0.45) slack = L[2] * 0.8;
    else if (p < 0.60) { slack = isTightLink ? 0.006 : 0.065; strainVal = isTightLink ? 0.6 : 0.15; }
    else { slack = isTightLink ? -0.004 : 0.035; strainVal = isTightLink ? 1.0 : 0.3; }

    let active = i < activeCount ? 1 : 0;
    if (i === 0 && p >= 0.25) active = 0;

    stage2Rope(i, a.x, a.y + L[3], b.x, b.y + L[4], slack, active, { floor: floorY, segments: 10, strain: strainVal });
  }
}

function drawMaleRestraints(male) {
  const p = stage2Progress;
  if (!male || p < 0.25) return;

  const floorY = height * STAGE2_GROUND_Y_RATIO + 15;
  const isS3 = p >= 0.60;

  const leftCords = [
    { id: 100, type: 'floor',   gx: width * 0.12, gy: height + 60, node: 'lFoot',     minP: 0.25, tight: true  },
    { id: 101, type: 'wall',    ax: -80,          ay: height * 0.72, node: 'lowerBody', minP: 0.25, tight: false },
    { id: 102, type: 'wall',    ax: -80,          ay: height * 0.48, node: 'upperBody', minP: 0.45, tight: true  },
    { id: 103, type: 'ceiling', cx: width * 0.18, cy: -60,             node: 'shoulder',  minP: 0.45, tight: false },
    { id: 104, type: 'wall',    ax: -80,          ay: height * 0.36, node: 'head',      minP: 0.60, tight: true  },
    { id: 105, type: 'wall',    ax: -80,          ay: height * 0.58, node: 'rHand',     minP: 0.60, tight: true  },
    { id: 106, type: 'floor',   gx: width * 0.04, gy: height + 60, node: 'lFoot',     minP: 0.60, tight: true  },
    { id: 107, type: 'floor',   gx: width * 0.22, gy: height + 60, node: 'rFoot',     minP: 0.60, tight: false },
    { id: 108, type: 'floor',   gx: width * 0.30, gy: height + 60, node: 'lowerBody', minP: 0.60, tight: true  },
    { id: 109, type: 'ceiling', cx: width * 0.08, cy: -60,             node: 'upperBody', minP: 0.60, tight: false },
    { id: 110, type: 'ceiling', cx: width * 0.28, cy: -60,             node: 'head',      minP: 0.60, tight: true  }
  ];

  for (let r of leftCords) {
    const active = p >= r.minP ? 1 : 0;
    const targetNode = male.nodes[r.node];

    let startX, startY;
    if (r.type === 'floor') { startX = r.gx; startY = r.gy; }
    else if (r.type === 'ceiling') { startX = r.cx; startY = r.cy; }
    else { startX = r.ax; startY = r.ay; }

    let slack = !isS3 ? (r.tight ? 0.010 : 0.055) : (r.tight ? -0.006 : 0.040);

    stage2Rope(r.id, startX, startY, targetNode.x, targetNode.y, slack, active, {
      floor: r.type === 'floor' ? undefined : floorY,
      segments: 10,
      strain: isS3 ? (r.tight ? 1.2 : 0.4) : (r.tight ? 0.5 : 0.15)
    });
  }
}

function drawStage2AtmosphericDecay(p) {
  if (p < 0.25) return;

  push();
  let cx = width * 0.5;
  let cy = height * 0.5;

  let innerR = p < 0.45 ? width * 0.28 : (p < 0.60 ? width * 0.22 : width * 0.12);
  let outerR = p < 0.45 ? width * 0.84 : (p < 0.60 ? width * 0.76 : width * 0.65);

  let vigGrad = drawingContext.createRadialGradient(cx, cy, innerR, cx, cy, outerR);

  if (p < 0.45) {
    let t = map(p, 0.25, 0.45, 0.0, 1.0);
    vigGrad.addColorStop(0, `rgba(10, 6, 12, 0)`);
    vigGrad.addColorStop(0.70, `rgba(12, 6, 14, ${0.18 * t})`);
    vigGrad.addColorStop(1, `rgba(8, 4, 10, ${0.52 * t})`);
  } else if (p < 0.60) {
    let t = map(p, 0.45, 0.60, 0.0, 1.0);
    vigGrad.addColorStop(0, `rgba(10, 5, 12, ${0.06 * t})`);
    vigGrad.addColorStop(0.60, `rgba(12, 5, 14, ${0.36 + 0.20 * t})`);
    vigGrad.addColorStop(1, `rgba(6, 2, 8, ${0.62 + 0.22 * t})`);
  } else {
    let t = map(p, 0.60, 1.0, 0.0, 1.0);
    vigGrad.addColorStop(0, `rgba(4, 2, 8, ${0.15 + 0.15 * t})`);
    vigGrad.addColorStop(0.50, `rgba(8, 2, 10, ${0.60 + 0.25 * t})`);
    vigGrad.addColorStop(1, `rgba(2, 0, 4, ${0.94 + 0.05 * t})`);
  }

  drawingContext.fillStyle = vigGrad;
  drawingContext.fillRect(0, 0, width, height);

  let scratchCount = p < 0.45 ? 2 : (p < 0.60 ? 4 : 10);
  strokeCap(ROUND);
  randomSeed(frameCount * 3);

  for (let i = 0; i < scratchCount; i++) {
    let sx = random(width * 0.05, width * 0.95);
    let sy = random(height * 0.10, height * 0.90);
    let sLen = random(20, p < 0.60 ? 55 : 135);
    let sAngle = random(-0.35, 0.35) + (p >= 0.60 ? random(-0.5, 0.5) : 0);

    if (p < 0.45) {
      stroke(18, 12, 20, random(45, 75));
      strokeWeight(random(0.6, 1.0));
    } else if (p < 0.60) {
      stroke(14, 8, 16, random(55, 110));
      strokeWeight(random(0.7, 1.3));
    } else {
      stroke(random() < 0.25 ? color(150, 18, 28, random(80, 160)) : color(6, 2, 8, random(120, 210)));
      strokeWeight(random(0.8, 2.2));
    }

    line(sx, sy, sx + sin(sAngle) * sLen, sy + cos(sAngle) * sLen);
  }

  if (p >= 0.60) {
    noStroke();
    for (let ash of ashParticles) {
      ash.x -= ash.vx;
      ash.y += sin(frameCount * 0.05 + ash.seed) * 0.6;
      if (ash.x < 0) { ash.x = width + random(20, 60); ash.y = random(height * 0.2, height * 0.95); }
      fill(ash.r, ash.g, ash.b, ash.alpha);
      circle(ash.x, ash.y, ash.sz);
    }
  }

  pop();
}

function updateAndRenderWhispers() {
  if (currentStage !== 2) return;

  let p = stage2Progress;

  if (p < 0.25) {
  } else if (p < 0.60) {
    let spawnRate = (p >= 0.45 || blackoutTimer > 0) ? 90 : 150;
    if (frameCount % spawnRate === 0) {
      spawnHauntingWhisper(STAGE2_STATE2_WHISPERS, false);
    }
  } else {
    if (frameCount % 32 === 0) {
      spawnHauntingWhisper(STAGE2_STATE3_WHISPERS, true);
    }
  }

  if (floatingWhispers.length === 0) return;

  push();
  textAlign(CENTER, CENTER);
  if (fontBeauty2) textFont(fontBeauty2);
  else textFont("Georgia");

  for (let i = floatingWhispers.length - 1; i >= 0; i--) {
    let w = floatingWhispers[i];
    w.life -= w.decay;
    w.x += w.vx + random(-w.shake, w.shake);
    w.y += w.vy;
    w.alpha = w.life * 255;

    if (w.alpha <= 0) {
      floatingWhispers.splice(i, 1);
      continue;
    }

    push();
    translate(w.x, w.y);
    textSize(w.size);

    let textColor = w.brutal ? color(255, 30, 45, w.alpha) : color(185, 30, 45, w.alpha * 0.95);

    noStroke();
    drawingContext.shadowColor = w.brutal ? `rgba(255, 10, 30, ${0.85 * w.life})` : `rgba(165, 15, 30, ${0.60 * w.life})`;
    drawingContext.shadowBlur = w.brutal ? 22 : 12;
    fill(textColor);
    text(w.text, 0, 0);

    pop();
  }
  pop();
}

function drawGuidanceText(txt, yPos) {
  push();
  textAlign(CENTER, CENTER);
  if (fontBeauty2) textFont(fontBeauty2);
  else textFont("Georgia");
  textSize(40);

  drawingContext.shadowBlur = 0;
  noStroke();
  fill(120, 78, 42, 235);
  text(txt, width * 0.5, yPos);

  pop();
}

function drawDrumUI() {
  let drumX = 200, drumY = height - 115;
  let drumR = 76 + drumPulse;
  drumPulse = lerp(drumPulse, 0, 0.12);

  push();
  translate(drumX, drumY);
  stroke(185, 140, 85); strokeWeight(4); fill(30, 18, 22, 230); circle(0, 0, drumR * 2);
  fill(215, 175, 125, 235); stroke(120, 80, 45); strokeWeight(2.5); circle(0, 0, drumR * 1.6);
  noStroke(); fill(180, 30, 35, 190); circle(0, 0, drumR * 0.55);

  if (!drumClickedOnce) {
    textAlign(CENTER, CENTER); textFont("Georgia");
    textSize(14); fill(255, 230, 180); text("DRUM", 0, -8);
    textSize(11); fill(215, 175, 125); text("BEAT", 0, 10);
  }
  pop();

  if (!drumClickedOnce) {
    drawGuidanceText("Beat the drum to move forward...", height * 0.20);
  }
}

function mousePressed() {
  if (currentStage === 2) {
    let d = dist(mouseX, mouseY, 200, height - 115);
    if (d < 80) triggerDrumBeat();
  }
}

function keyPressed() {
  if (currentStage === 2 && (key === " " || key === "d" || key === "D")) {
    triggerDrumBeat();
  }
}

function triggerDrumBeat() {
  if (blackoutTimer > 0 || curtainProgress > 0.05) return;

  drumClickedOnce = true;

  if (stage2Progress >= 1.0) {
    startStageTransition(3);
    return;
  }

  drumPulse = 18;
  let p = stage2Progress, inc, scroll;
  if (p < 0.25)        { inc = 0.020; scroll = 80; }
  else if (p < 0.60) { inc = 0.013; scroll = 40; }
  else               { inc = 0.0075; scroll = 16; }

  if (p >= 0.60) {
    camShakeY = 7;
    camShakeX = random(-4, 4);
  } else if (p >= 0.45) {
    camShakeY = 3;
    camShakeX = random(-1.5, 1.5);
  }

  let nextP = constrain(p + inc, 0.0, 1.0);

  if (p < 0.45 && nextP >= 0.45 && !s2EnteredState2Jump) {
    blackoutTimer = BLACKOUT_DURATION;
    pendingJumpTrigger = 'state2';
  } else if (p < 0.60 && nextP >= 0.60 && !s2EnteredState3) {
    blackoutTimer = BLACKOUT_DURATION;
    pendingJumpTrigger = 'state3';
  }

  walkStepProgress = p < 0.60 ? 1.0 : 0.75;
  worldScrollTarget += scroll;
  stage2Progress = nextP;

  if (stage2Progress >= 1.0) {
    startStageTransition(3);
  }
}

function preload() {
  handPose = ml5.handPose({ flipped: true });

  fontBeauty2 = loadFont("Fonts/Housemail Script Trial.otf");

  imgMaleHead           = loadImage("Assets/male_head.png");
  imgMaleUpperBody      = loadImage("Assets/male_upper_body.png");
  imgMaleLowerBody      = loadImage("Assets/male_lower_body.png");
  imgMaleUpperArm       = loadImage("Assets/male_upper_arm.png");
  imgMaleLowerArmOuter  = loadImage("Assets/male_lower_arm_outer.png");
  imgMaleLowerArmWithin = loadImage("Assets/male_lower_arm_within.png");
  imgMaleLeg            = loadImage("Assets/male_leg.png");

  imgFemaleHead          = loadImage("Assets/female_head.png");
  imgFemaleUpperBody     = loadImage("Assets/female_upper_body.png");
  imgFemaleLowerBody     = loadImage("Assets/female_lower_body.png");
  imgFemaleUpperArm      = loadImage("Assets/female_upper_arm.png");
  imgFemaleLowerArmOuter = loadImage("Assets/female_lower_arm_outer.png");
  imgFemaleLowerArmInner = loadImage("Assets/female_lower_arm_inner.png");
  imgFemaleLeg           = loadImage("Assets/female_leg.png");

  imgBg       = loadImage("Assets/background_1.png");
  imgBranches = loadImage("Assets/Branches_1.png");
  imgBridge   = loadImage("Assets/Bridge_1.png");
  imgCurtain  = loadImage("Assets/CURTAIN.png");

  imgBgStage       = loadImage("Assets/Background_stage.png");
  imgMountains2    = loadImage("Assets/Mountains_2.png");
  imgBigMountains2 = loadImage("Assets/Big_Mountains_2.png");
  imgDecor2        = loadImage("Assets/decor_2.png");
  imgGrass2        = loadImage("Assets/GRASS_2.png");

  imgChair3   = loadImage("Assets/Chair_3.png");
  imgChair23  = loadImage("Assets/Chair2_3.png");
  imgCloset3  = loadImage("Assets/Closet_3.png");
  imgFloor3   = loadImage("Assets/Floor_3.png");
  imgLamp3    = loadImage("Assets/Lamp_3.png");
  imgPicture3 = loadImage("Assets/Picture_3.png");
  imgTable3   = loadImage("Assets/Table_3.png");

  imgStageFrame = loadImage("Assets/Stage_frame.png");
}

function setup() {
  document.body.style.margin = "0";
  document.body.style.padding = "0";
  document.body.style.overflow = "hidden";
  document.body.style.backgroundColor = "#070408";

  createCanvas(windowWidth, windowHeight);

  video = createCapture(VIDEO, () => {
    handPose.detectStart(video, results => { hands = results; });
  });
  video.size(VIDEO_W, VIDEO_H);
  video.hide();

  puppets.push(new MalePuppet(width * 0.10, "left"));
  puppets.push(new FemalePuppet(width * 0.90, "right"));

  for (let i = 0; i < 40; i++) {
    ashParticles.push({
      x: random(width),
      y: random(height * 0.2, height * 0.95),
      vx: random(2.5, 6.0),
      sz: random(1.5, 4.0),
      seed: random(100),
      r: random(20, 50),
      g: random(10, 25),
      b: random(15, 30),
      alpha: random(110, 220)
    });
  }
}

function drawStage3Prop(prop) {
  let img = prop.img;
  if (!img || !img.width || !img.height) return;

  let s = height / img.height;
  let w = img.width * s;
  let h = height;
  let baseX = (width - w) * 0.5;

  if (prop.cooldown > 0) prop.cooldown--;

  let isSplit = prop.hits >= prop.maxHits;
  let px = baseX + w * prop.xRatio;
  let py = height * prop.yRatio;
  let floorY = height * STAGE2_GROUND_Y_RATIO + 20;

  if (isSplit) {
    if (!prop.splitPhysics) {
      prop.splitPhysics = {
        left:  { offX: 0, offY: 0, vx: random(-5.0, -8.0), vy: random(2.0, 5.0), rot: 0, vrot: random(-0.04, -0.08) },
        right: { offX: 0, offY: 0, vx: random(5.0, 8.0),    vy: random(2.0, 5.0), rot: 0, vrot: random(0.04, 0.08) }
      };
    }

    let maxDrop = max(30, floorY - py);

    for (let side of ['left', 'right']) {
      let p = prop.splitPhysics[side];
      p.vy += 0.70;
      p.offX += p.vx;
      p.offY += p.vy;
      p.rot += p.vrot;

      if (p.offY >= maxDrop) {
        p.offY = maxDrop;
        p.vy = -p.vy * 0.32;
        p.vx *= 0.70;
        p.vrot *= 0.55;
        if (abs(p.vy) < 0.5) p.vy = 0;
      }
    }

    let imgRelX = -(w * prop.xRatio);
    let imgRelY = -(h * prop.yRatio);

    push();
    translate(px + prop.splitPhysics.left.offX, py + prop.splitPhysics.left.offY);
    rotate(prop.splitPhysics.left.rot);
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(-w, -h * 1.5, w, h * 3);
    drawingContext.clip();
    image(img, imgRelX, imgRelY, w, h);
    drawingContext.restore();
    pop();

    push();
    translate(px + prop.splitPhysics.right.offX, py + prop.splitPhysics.right.offY);
    rotate(prop.splitPhysics.right.rot);
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(0, -h * 1.5, w, h * 3);
    drawingContext.clip();
    image(img, imgRelX, imgRelY, w, h);
    drawingContext.restore();
    pop();
    return;
  }

  push();
  let damageTilt = (prop.hits / prop.maxHits) * 0.12 * (prop.key === 'picture' ? 1.6 : 0.8);
  let damageSagY = (prop.hits / prop.maxHits) * 14;

  translate(baseX + w / 2, h / 2 + damageSagY);
  rotate(damageTilt);
  image(img, -w / 2, -h / 2, w, h);
  pop();
}

function handleKatanaInputAndRender() {
  if (curtainProgress > 0.05) return null;

  let bladeTipX = mouseX;
  let bladeTipY = mouseY;

  if (hands && hands.length > 0 && hands[0].keypoints && hands[0].keypoints[8]) {
    let indexFinger = hands[0].keypoints[8];
    bladeTipX = map(indexFinger.x, VIDEO_W * 0.1, VIDEO_W * 0.9, width * 0.05, width * 0.95);
    bladeTipY = map(indexFinger.y, VIDEO_H * 0.1, VIDEO_H * 0.9, height * 0.1, height * 0.9);
  }

  let slashDist = dist(bladeTipX, bladeTipY, pmouseX, pmouseY);
  let isSlashing = slashDist > 7 || mouseIsPressed;

  bladeTrail.unshift({ x: bladeTipX, y: bladeTipY });
  if (bladeTrail.length > 16) bladeTrail.pop();

  let slashSeg = null;
  if (isSlashing && bladeTrail.length >= 2) {
    slashSeg = { x1: bladeTrail[0].x, y1: bladeTrail[0].y, x2: bladeTrail[1].x, y2: bladeTrail[1].y };
    totalSlashesCount++;
  }

  push();
  noFill();
  for (let i = 0; i < bladeTrail.length - 1; i++) {
    let p1 = bladeTrail[i];
    let p2 = bladeTrail[i + 1];
    let alpha = map(i, 0, bladeTrail.length, 220, 0);
    let sw = map(i, 0, bladeTrail.length, 3.8, 0.4);

    stroke(255, 255, 255, alpha);
    strokeWeight(sw);
    line(p1.x, p1.y, p2.x, p2.y);

    stroke(200, 40, 50, alpha * 0.6);
    strokeWeight(sw + 2);
    line(p1.x, p1.y, p2.x, p2.y);
  }
  pop();

  push();
  translate(bladeTipX, bladeTipY);
  let bladeAngle = atan2(bladeTipY - pmouseY, bladeTipX - pmouseX) || -0.8;
  rotate(bladeAngle - HALF_PI);

  stroke(240, 240, 245);
  strokeWeight(2.4);
  line(0, 0, 0, 60);

  stroke(255, 255, 255);
  strokeWeight(1.0);
  line(-0.8, 3, -0.8, 55);

  stroke(215, 175, 95);
  strokeWeight(3.5);
  line(-7, 60, 7, 60);

  stroke(20, 14, 18);
  strokeWeight(3.5);
  line(0, 62, 0, 88);
  pop();

  for (let i = slashSparks.length - 1; i >= 0; i--) {
    let sp = slashSparks[i];
    sp.x += sp.vx;
    sp.y += sp.vy;
    sp.vy += 0.3;
    sp.alpha -= 6.0;

    fill(sp.r, sp.g, sp.b, sp.alpha);
    noStroke();
    circle(sp.x, sp.y, sp.sz);

    if (sp.alpha <= 0) slashSparks.splice(i, 1);
  }

  return slashSeg;
}

function processStage3Destruction(slashSeg) {
  if (!slashSeg) return;

  let slashMidX = (slashSeg.x1 + slashSeg.x2) * 0.5;
  let slashMidY = (slashSeg.y1 + slashSeg.y2) * 0.5;

  for (let puppet of puppets) {
    if (puppet.partCooldown > 0) puppet.partCooldown--;

    let partsCheck = [
      { name: 'head',          node: puppet.nodes.head,          img: puppet === puppets[0] ? imgMaleHead : imgFemaleHead, r: 55, maxHits: 1 },
      { name: 'upperBody',     node: puppet.nodes.upperBody,     img: puppet === puppets[0] ? imgMaleUpperBody : imgFemaleUpperBody, r: 60, maxHits: 1 },
      { name: 'lowerBody',     node: puppet.nodes.lowerBody,     img: puppet === puppets[0] ? imgMaleLowerBody : imgFemaleLowerBody, r: 65, maxHits: 1 },
      { name: 'frontLowerArm', node: puppet.nodes.rHand,         img: puppet === puppets[0] ? imgMaleLowerArmOuter : imgFemaleLowerArmOuter, r: 48, maxHits: 1 },
      { name: 'backLowerArm',  node: puppet.nodes.lHand,         img: puppet === puppets[0] ? imgMaleLowerArmWithin : imgFemaleLowerArmInner, r: 48, maxHits: 1 },
      { name: 'lLeg',          node: puppet.nodes.lFoot,         img: puppet === puppets[0] ? imgMaleLeg : imgFemaleLeg, r: 55, maxHits: 1 },
      { name: 'rLeg',          node: puppet.nodes.rFoot,         img: puppet === puppets[0] ? imgMaleLeg : imgFemaleLeg, r: 55, maxHits: 1 }
    ];

    for (let part of partsCheck) {
      if (puppet.severed[part.name]) continue;

      let d = distToSegment(part.node.x, part.node.y, slashSeg.x1, slashSeg.y1, slashSeg.x2, slashSeg.y2);
      if (d < part.r + 25) {
        let strikeDir = slashMidX > part.node.x ? -1 : 1;
        part.node.x += strikeDir * 12;
        part.node.oldX += strikeDir * 16;
        propagateGlobalImpulse(part.node.x, part.node.y, strikeDir * 12, -5);

        if (puppet.partCooldown === 0) {
          puppet.hitCounts[part.name]++;
          puppet.partCooldown = 8;

          for (let k = 0; k < 8; k++) {
            slashSparks.push({
              x: part.node.x, y: part.node.y,
              vx: random(-4, 4), vy: random(-5, 1),
              sz: random(2, 4),
              r: 180, g: 140, b: 90,
              alpha: 220
            });
          }

          if (puppet.hitCounts[part.name] >= part.maxHits) {
            puppet.severed[part.name] = true;
            camShakeY = 6; camShakeX = random(-4, 4);
            targetZoom = 1.07;
            screenFlashAlpha = 140;
            screenFlashColor = [20, 4, 8];

            generativeDesaturation = random(0.3, 0.7);
            generativeContrastGlitch = random(1.15, 1.45);

            let tossVx = (part.node.x - slashMidX) * 0.25 + random(-4, 4);
            let tossVy = -random(7, 13);

            fallingParts.push({
              img: part.img,
              x: part.node.x,
              y: part.node.y,
              vx: tossVx,
              vy: tossVy,
              rot: random(-0.3, 0.3),
              vrot: random(-0.12, 0.12),
              scaleVal: puppet.scaleVal,
              flip: puppet === puppets[0] ? -1 : 1,
              groundHitCount: 0
            });

            for (let k = 0; k < 20; k++) {
              slashSparks.push({
                x: part.node.x, y: part.node.y,
                vx: random(-6, 6), vy: random(-7, 2),
                sz: random(3, 6),
                r: 220, g: random(20, 50), b: random(30, 50),
                alpha: 255
              });
            }
          }
        }
      }
    }
  }

  for (let prop of stage3Props) {
    if (prop.hits >= prop.maxHits || prop.cooldown > 0) continue;

    let refImg = prop.img || imgFloor3;
    let s = height / refImg.height;
    let w = refImg.width * s;
    let baseX = (width - w) * 0.5;

    let targetX = baseX + w * prop.xRatio;
    let targetY = height * prop.yRatio;
    let d = distToSegment(targetX, targetY, slashSeg.x1, slashSeg.y1, slashSeg.x2, slashSeg.y2);

    if (d < prop.radius + 35) {
      prop.hits++;
      prop.cooldown = 8;
      camShakeY = 4.5;
      camShakeX = random(-3, 3);

      let isCriticalHit = prop.hits >= prop.maxHits;
      if (isCriticalHit) {
        targetZoom = 1.05;
        screenFlashAlpha = 70;
        screenFlashColor = [15, 4, 8];
        generativeContrastGlitch = random(1.1, 1.3);
      }

      let sparkCount = isCriticalHit ? 24 : 6;
      for (let k = 0; k < sparkCount; k++) {
        slashSparks.push({
          x: targetX, y: targetY,
          vx: random(-5, 5), vy: random(-5, 2),
          sz: random(2, 4.5),
          r: prop.key === 'lamp' ? 230 : 170,
          g: prop.key === 'lamp' ? 190 : 130,
          b: prop.key === 'lamp' ? 120 : 85,
          alpha: 210
        });
      }
    }
  }
}

function updateAndRenderFallingParts() {
  let floorLimit = height * STAGE2_GROUND_Y_RATIO + 22;

  for (let fp of fallingParts) {
    fp.vy += 0.55;
    fp.x += fp.vx;
    fp.y += fp.vy;
    fp.rot += fp.vrot;

    if (fp.y >= floorLimit) {
      fp.y = floorLimit;
      fp.vy = -fp.vy * 0.52;
      fp.vx *= 0.72;
      fp.vrot *= 0.7;
      fp.groundHitCount++;

      if (abs(fp.vy) < 0.5) fp.vy = 0;
    }

    push();
    translate(fp.x, fp.y);
    rotate(fp.rot);
    scale(fp.flip, 1);
    imageMode(CENTER);
    image(fp.img, 0, 0, fp.img.width * fp.scaleVal, fp.img.height * fp.scaleVal);
    pop();
  }
}

function updateAndRenderGenerativeSilkDust() {
  push();
  noFill();
  for (let i = generativeSilkDust.length - 1; i >= 0; i--) {
    let d = generativeSilkDust[i];
    d.life -= d.decay;
    d.x += d.vx + (noise(d.seed, frameCount * 0.02) - 0.5) * 2;
    d.y += d.vy;

    stroke(d.r, d.g, d.b, d.life * 210);
    strokeWeight(1.2 * d.life);

    beginShape();
    let cx = d.x, cy = d.y;
    for (let j = 0; j < 6; j++) {
      let ang = noise(d.seed + j * 0.3, frameCount * 0.03) * TWO_PI * 1.5;
      let stepLen = d.len * 0.2;
      cx += cos(ang) * stepLen;
      cy += sin(ang) * stepLen;
      curveVertex(cx, cy);
    }
    endShape();

    if (d.life <= 0) generativeSilkDust.splice(i, 1);
  }
  pop();
}

function updateAndRenderStage1EmbraceLove(p1, p2) {
  if (hugProgress <= 0.05) return;

  let midX = (p1.nodes.lowerBody.x + p2.nodes.lowerBody.x) * 0.5;
  let waistY = (p1.nodes.lowerBody.y + p2.nodes.lowerBody.y) * 0.5 + FINAL_HUG_POSE.heightOffset;

  push();
  let loveGlowR = map(hugProgress, 0.05, 1.0, 80, 320);
  let loveGrad = drawingContext.createRadialGradient(midX, waistY, 15, midX, waistY, loveGlowR);
  loveGrad.addColorStop(0, `rgba(255, 110, 130, ${0.28 * hugProgress})`);
  loveGrad.addColorStop(0.55, `rgba(230, 45, 70, ${0.14 * hugProgress})`);
  loveGrad.addColorStop(1, "rgba(10, 4, 8, 0)");
  drawingContext.fillStyle = loveGrad;
  rectMode(CORNER);
  rect(0, 0, width, height);
  pop();

  if (stage1LoveSparks.length < 36 && random() < 0.55 * hugProgress) {
    stage1LoveSparks.push({
      x: random(width * 0.05, width * 0.95),
      y: random(height * 0.2, height * 0.85),
      vx: random(-0.7, 0.7),
      vy: random(-1.3, -0.4),
      size: random(4.0, 7.5),
      alpha: 255,
      life: 1.0,
      decay: random(0.007, 0.015),
      isRed: random() < 0.6
    });
  }

  push();
  noStroke();
  for (let i = stage1LoveSparks.length - 1; i >= 0; i--) {
    let sp = stage1LoveSparks[i];
    sp.life -= sp.decay;
    sp.x += sp.vx + sin(frameCount * 0.04 + sp.y) * 0.5;
    sp.y += sp.vy;
    sp.alpha = sp.life * 255;

    drawingContext.shadowBlur = 14;
    if (sp.isRed) {
      drawingContext.shadowColor = `rgba(255, 60, 80, ${0.9 * sp.life})`;
      fill(255, 75, 95, sp.alpha);
    } else {
      drawingContext.shadowColor = `rgba(255, 200, 100, ${0.9 * sp.life})`;
      fill(255, 220, 140, sp.alpha);
    }
    circle(sp.x, sp.y, sp.size);

    if (sp.life <= 0) stage1LoveSparks.splice(i, 1);
  }
  pop();
}

function draw() {
  background(15, 12, 20);
  imageMode(CORNER);

  let noiseDriftX = (noise(frameCount * 0.04) - 0.5) * (currentStage === 3 ? 5 : 2);
  let noiseDriftY = (noise(frameCount * 0.04 + 100) - 0.5) * (currentStage === 3 ? 5 : 2);

  camShakeX = lerp(camShakeX, 0, 0.16);
  camShakeY = lerp(camShakeY, 0, 0.16);
  camZoom = lerp(camZoom, targetZoom, 0.15);
  targetZoom = lerp(targetZoom, 1.0, 0.06);

  generativeDesaturation = lerp(generativeDesaturation, 0, 0.04);
  generativeContrastGlitch = lerp(generativeContrastGlitch, 1.0, 0.05);

  if (currentStage === 1) {
    if (imgBg) image(imgBg, 0, 0, width, height);
    if (imgBranches) image(imgBranches, 0, 0, width, height);

    for (let puppet of puppets) puppet.updateControls(hands);
    if (puppets.length >= 2) handleAutonomousFlight(puppets[0], puppets[1]);
    for (let puppet of puppets) puppet.updatePhysics();
    if (puppets.length >= 2) lockKeyframeHugPose(puppets[0], puppets[1]);

    push();
    drawingContext.filter = "sepia(0.10) brightness(1.04) contrast(1.03) saturate(1.06)";
    if (puppets.length >= 2) {
      puppets[0].displayStrings();
      puppets[1].displayStrings();

      drawApproachStrings(puppets[0], puppets[1]);
      drawBackWrapStrings(puppets[0], puppets[1]);

      puppets[1].displayBackArm();
      puppets[0].displayBackArm();
      puppets[1].displayBody();
      puppets[0].displayBody();
      puppets[1].displayFrontArm();
      puppets[0].displayFrontArm();

      drawFrontWrappedStrings(puppets[0], puppets[1]);
      updateAndRenderStage1EmbraceLove(puppets[0], puppets[1]);
    }
    drawingContext.filter = "none";
    pop();

    if (imgBridge) image(imgBridge, 0, 0, width, height);

    if (!userInteractedInStage1 && !isAutoFlying && hugProgress < 0.02 && curtainProgress < 0.15) {
      drawGuidanceText("Bring them closer together slowly...", height * 0.20);
    }

    if (hugProgress >= 0.96 && curtainState === "IDLE") {
      stage1EmbraceTimer++;
      if (stage1EmbraceTimer > EMBRACE_PLAY_TIME) {
        startStageTransition(2);
      }
    }
  } else if (currentStage === 2) {
    worldScrollX = lerp(worldScrollX, worldScrollTarget, stage2Progress < 0.6 ? 0.08 : 0.04);

    let isBlackout = blackoutTimer > 0;
    let blackoutT = isBlackout ? 1.0 : 0.0;
    let p = stage2Progress;

    push();
    translate(camShakeX + noiseDriftX, camShakeY + noiseDriftY);

    push();
    if (blackoutT > 0.01) {
      drawingContext.filter = "brightness(0.06) contrast(1.5) saturate(0.25) hue-rotate(210deg)";
    } else {
      if (p < 0.25) {
        drawingContext.filter = "none";
      } else if (p < 0.45) {
        let s2t = map(p, 0.25, 0.45, 0, 1);
        let b = lerp(1.0, 0.93, s2t);
        let c = lerp(1.0, 1.09, s2t);
        let s = lerp(1.0, 0.86, s2t);
        let hue = lerp(0, -9, s2t);
        drawingContext.filter = `brightness(${b}) contrast(${c}) saturate(${s}) hue-rotate(${hue}deg) sepia(${0.14 * s2t})`;
      } else if (p < 0.60) {
        let s2t = map(p, 0.45, 0.60, 0, 1);
        let b = lerp(0.92, 0.82, s2t);
        let c = lerp(1.08, 1.25, s2t);
        let s = lerp(0.88, 0.65, s2t);
        let hue = lerp(-6, -18, s2t);
        drawingContext.filter = `brightness(${b}) contrast(${c}) saturate(${s}) hue-rotate(${hue}deg) sepia(0.28)`;
      } else {
        let s3t = map(p, 0.60, 1.0, 0, 1);
        let b = lerp(0.92, 0.74, s3t);
        let c = lerp(1.10, 1.40, s3t);
        let s = lerp(0.85, 0.50, s3t);
        let hue = lerp(-6, -30, s3t);
        drawingContext.filter = `brightness(${b}) contrast(${c}) saturate(${s}) hue-rotate(${hue}deg) sepia(0.48)`;
      }
    }

    if (imgBgStage) image(imgBgStage, 0, 0, width, height);
    drawRepeatingLayer(imgMountains2, worldScrollX, 0.22);
    drawRepeatingLayer(imgBigMountains2, worldScrollX, 0.48);
    if (imgDecor2) image(imgDecor2, 0, 0, width, height);
    drawRepeatingLayer(imgGrass2, worldScrollX, 1.0);

    for (let puppet of puppets) puppet.updateControls(hands);
    handleStage2Kinematics(puppets[0], puppets[1]);
    for (let puppet of puppets) puppet.updatePhysics();

    push();
    if (blackoutT > 0.01) {
      drawingContext.filter = "brightness(0.08) contrast(1.4) saturate(0.35)";
    } else {
      if (p < 0.25) {
        drawingContext.filter = "sepia(0.10) brightness(1.04) contrast(1.03) saturate(1.06)";
      } else if (p < 0.45) {
        let s2t = map(p, 0.25, 0.45, 0, 1);
        drawingContext.filter = `sepia(${lerp(0.10, 0.20, s2t)}) brightness(${lerp(1.04, 0.95, s2t)}) contrast(1.08) saturate(${lerp(1.06, 0.92, s2t)})`;
      } else if (p < 0.60) {
        let s2t = map(p, 0.45, 0.60, 0, 1);
        drawingContext.filter = `sepia(${lerp(0.18, 0.35, s2t)}) brightness(${lerp(0.96, 0.86, s2t)}) contrast(1.18) saturate(${lerp(0.92, 0.72, s2t)}) hue-rotate(-10deg)`;
      } else {
        drawingContext.filter = "sepia(0.55) brightness(0.82) contrast(1.30) saturate(0.70) hue-rotate(-18deg)";
      }
    }

    puppets[0].displayStrings();
    puppets[1].displayStrings();

    puppets[1].displayBackArm();
    puppets[0].displayBackArm();
    puppets[1].displayBody();
    puppets[0].displayBody();
    puppets[1].displayFrontArm();
    puppets[0].displayFrontArm();
    pop();

    drawingContext.filter = "none";
    drawMaleRestraints(puppets[0]);
    drawEntangledSilkNetwork(puppets[0], puppets[1]);

    pop();

    if (blackoutT <= 0.01) {
      drawStage2AtmosphericDecay(p);
    } else {
      push();
      let cx = width * 0.5, cy = height * 0.5;
      let grad = drawingContext.createRadialGradient(cx, cy, width * 0.12, cx, cy, width * 0.78);
      grad.addColorStop(0, "rgba(5, 3, 10, 0.84)");
      grad.addColorStop(1, "rgba(2, 1, 5, 0.97)");
      drawingContext.fillStyle = grad;
      drawingContext.fillRect(0, 0, width, height);
      pop();
    }

    pop();

    updateAndRenderWhispers();

    if (isBlackout) blackoutTimer--;
    drawDrumUI();
  } else if (currentStage === 3) {
    push();
    translate(camShakeX + noiseDriftX, camShakeY + noiseDriftY);

    let dSat = 0.88 * (1.0 - generativeDesaturation);
    let dContrast = 1.08 * generativeContrastGlitch;
    drawingContext.filter = `sepia(0.24) brightness(0.88) contrast(${dContrast}) saturate(${dSat})`;

    if (imgBgStage) image(imgBgStage, 0, 0, width, height);

    for (let prop of stage3Props) {
      if (prop.key === 'picture' || prop.key === 'closet') drawStage3Prop(prop);
    }

    if (imgFloor3) image(imgFloor3, 0, 0, width, height);

    for (let prop of stage3Props) {
      if (prop.key !== 'picture' && prop.key !== 'closet') drawStage3Prop(prop);
    }

    for (let puppet of puppets) {
      puppet.updateControls(hands);
      puppet.updatePhysics();
    }

    if (!stage3TotalDestructionTriggered) {
      puppets[0].displayStrings();
      puppets[1].displayStrings();
    }

    puppets[1].displayBackArm();
    puppets[0].displayBackArm();
    puppets[1].displayBody();
    puppets[0].displayBody();
    puppets[1].displayFrontArm();
    puppets[0].displayFrontArm();

    updateAndRenderFallingParts();

    drawingContext.filter = "none";
    pop();

    let slashSeg = handleKatanaInputAndRender();

    for (let rope of stage3Ropes) {
      rope.update(slashSeg);
      rope.display();
    }

    processStage3Destruction(slashSeg);

    let allRopesCut = stage3Ropes.length > 0 && stage3Ropes.every(r => r.severed);
    if (allRopesCut && !stage3TotalDestructionTriggered) {
      triggerStage3TotalDestruction();
    }

    if (stage3TotalDestructionTriggered && !isFinaleCurtainClosed) {
      stage3PostDestructionTimer++;
      if (stage3PostDestructionTimer > POST_DESTRUCTION_WAIT) {
        isFinaleCurtainClosed = true;
        curtainState = "CLOSING";
      }
    }

    push();
    let cx = width * 0.5, cy = height * 0.5;
    let vigGrad = drawingContext.createRadialGradient(cx, cy, width * 0.22, cx, cy, width * 0.74);
    vigGrad.addColorStop(0, "rgba(8, 4, 6, 0)");
    vigGrad.addColorStop(0.70, "rgba(14, 8, 10, 0.35)");
    vigGrad.addColorStop(1, "rgba(4, 2, 4, 0.78)");
    drawingContext.fillStyle = vigGrad;
    drawingContext.fillRect(0, 0, width, height);
    pop();

    stage3SubtitleAlpha = min(230, stage3SubtitleAlpha + 2.5);
    push();
    textAlign(CENTER, CENTER);
    if (fontBeauty2) textFont(fontBeauty2);
    else textFont("Georgia");
    textSize(46);
    let pulse = sin(frameCount * 0.05) * 15;

    let displayTxt = stage3TotalDestructionTriggered ? "All threads severed." : "Cut the string.";
    
    fill(10, 2, 4, stage3SubtitleAlpha * 0.95);
    text(displayTxt, width * 0.5 + 2, height * 0.16 + 2);

    fill(stage3TotalDestructionTriggered ? color(225, 45, 55) : color(240, 210, 180), stage3SubtitleAlpha + pulse);
    drawingContext.shadowColor = stage3TotalDestructionTriggered ? "rgba(220, 20, 30, 0.85)" : "rgba(180, 50, 40, 0.6)";
    drawingContext.shadowBlur = 24;
    text(displayTxt, width * 0.5, height * 0.16);
    pop();
  }

  updateAndRenderMasterCurtain();

  if (imgStageFrame) {
    push();
    if (currentStage === 2) {
      let isBlackout = blackoutTimer > 0;
      let p = stage2Progress;
      if (isBlackout) {
        drawingContext.filter = "brightness(0.55) sepia(0.12) contrast(1.06)";
      } else if (p >= 0.60) {
        drawingContext.filter = "sepia(0.22) brightness(0.88) contrast(1.10) hue-rotate(-8deg)";
      } else if (p >= 0.45) {
        let s2t = map(p, 0.45, 0.60, 0, 1);
        drawingContext.filter = `sepia(${0.06 + 0.09 * s2t}) brightness(${0.97 - 0.05 * s2t}) contrast(${1.02 + 0.04 * s2t})`;
      } else if (p >= 0.25) {
        let s2t = map(p, 0.25, 0.45, 0, 1);
        drawingContext.filter = `sepia(${0.10 * s2t}) brightness(${1.0 - 0.06 * s2t}) contrast(${1.0 + 0.05 * s2t})`;
      }
    } else if (currentStage === 3) {
      drawingContext.filter = "sepia(0.15) brightness(0.90) contrast(1.08)";
    }
    image(imgStageFrame, 0, 0, width, height);
    pop();
  }

  if (currentStage === 1 && curtainProgress < 0.15) {
    drawWebcamPIP();
  }
}

function drawWebcamPIP() {
  let pipW = 180, pipH = 135;
  let pipX = width - pipW - 20, pipY = height - pipH - 20;

  push();
  rectMode(CORNER);
  stroke(185, 145, 95, 160);
  strokeWeight(2);
  fill(12, 8, 10, 200);
  rect(pipX - 2, pipY - 2, pipW + 4, pipH + 4, 6);

  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.roundRect(pipX, pipY, pipW, pipH, 4);
  drawingContext.clip();

  push();
  translate(pipX + pipW, pipY);
  scale(-1, 1);
  tint(225, 185, 135, 235);
  image(video, 0, 0, pipW, pipH);
  pop();
  noTint();

  if (!userInteractedInStage1) {
    let t = frameCount * 0.05;
    let ringRadius = 24 + sin(t * 1.5) * 8;
    let ringAlpha = map(sin(t * 1.5), -1, 1, 60, 200);

    push();
    translate(pipX + pipW * 0.5, pipY + pipH * 0.5);
    noFill();
    stroke(255, 220, 140, ringAlpha);
    strokeWeight(1.8);
    ellipse(0, 0, ringRadius * 2, ringRadius * 2);

    fill(255, 220, 140, ringAlpha * 1.2);
    noStroke();
    ellipse(0, 0, 7, 7);

    textAlign(CENTER, TOP);
    textFont("Georgia");
    textSize(11);
    fill(255, 235, 190, ringAlpha);
    text("Raise Hand Here", 0, 26);
    pop();
  }

  drawingContext.restore();
  pop();
}

function getBridgeArchY(x) {
  let archSpan = width * 0.72;
  let cx = width * 0.5;
  let rel = constrain((x - cx) / (archSpan * 0.5), -1, 1);
  let baseDeck = height * 0.82;
  let archRise = height * 0.10;
  return baseDeck - archRise * cos(rel * HALF_PI);
}

function handleAutonomousFlight(p1, p2) {
  if (!p1 || !p2 || !p1.nodes || !p2.nodes) return;
  let d = dist(p1.nodes.lowerBody.x, p1.nodes.lowerBody.y, p2.nodes.lowerBody.x, p2.nodes.lowerBody.y);

  let userForcingSeparation = false;
  if (hands.length >= 2) {
    let span = abs(hands[0].keypoints[0].x - hands[1].keypoints[0].x);
    if (span > VIDEO_W * 0.70) userForcingSeparation = true;
  }

  if (!isAutoFlying && curtainState === "IDLE" && d < HUG_CONFIG.triggerDistance && !userForcingSeparation) {
    isAutoFlying = true;
    flightProgress = 0.0;
    hugProgress = 0.0;
    flightStartX1 = p1.restX;
    flightStartX2 = p2.restX;
  }

  if (isAutoFlying && (userForcingSeparation || d > HUG_CONFIG.releaseDistance)) {
    isAutoFlying = false;
    flightProgress = 0.0;
    hugProgress = 0.0;
  }

  let sc = 0.8;
  if (isAutoFlying) {
    let stageCenterX = width * 0.5;
    let targetX1 = stageCenterX - FINAL_HUG_POSE.bodyOffset;
    let targetX2 = stageCenterX + FINAL_HUG_POSE.bodyOffset;

    if (flightProgress < 1.0) {
      flightProgress = min(1.0, flightProgress + HUG_CONFIG.flightSpeed);
      let p = flightProgress;

      let xT = constrain(map(p, 0.0, 0.45, 0.0, 1.0), 0.0, 1.0);
      let smoothXT = 0.5 - 0.5 * cos(xT * PI);
      p1.restX = lerp(flightStartX1, targetX1, smoothXT);
      p2.restX = lerp(flightStartX2, targetX2, smoothXT);

      let leapLift = 0;
      if (p < 0.40) leapLift = sin(map(p, 0.0, 0.40, 0.0, HALF_PI)) * HUG_CONFIG.peakLift;
      else if (p < 0.72) leapLift = HUG_CONFIG.peakLift;
      else leapLift = sin(map(p, 0.72, 1.0, HALF_PI, PI)) * HUG_CONFIG.peakLift;

      let floorY1 = getBridgeArchY(p1.restX);
      let floorY2 = getBridgeArchY(p2.restX);

      p1.ctrls.head.x = p1.restX;
      p1.ctrls.head.y = floorY1 - 330 * sc - leapLift + FINAL_HUG_POSE.heightOffset;
      p2.ctrls.head.x = p2.restX;
      p2.ctrls.head.y = floorY2 - 330 * sc - leapLift + FINAL_HUG_POSE.heightOffset;

      p1.ctrls.lFoot.y = floorY1 - 20 * sc - leapLift;
      p1.ctrls.rFoot.y = floorY1 - 20 * sc - leapLift;
      p2.ctrls.lFoot.y = floorY2 - 20 * sc - leapLift;
      p2.ctrls.rFoot.y = floorY2 - 20 * sc - leapLift;

      let dx1 = (p1.restX - p1.nodes.lowerBody.x) * 0.16;
      let dy1 = ((floorY1 - 118 * sc - leapLift + FINAL_HUG_POSE.heightOffset) - p1.nodes.lowerBody.y) * 0.16;
      for (let n of p1.nodesList) { n.x += dx1; n.oldX += dx1; n.y += dy1; n.oldY += dy1; }

      let dx2 = (p2.restX - p2.nodes.lowerBody.x) * 0.16;
      let dy2 = ((floorY2 - 118 * sc - leapLift + FINAL_HUG_POSE.heightOffset) - p2.nodes.lowerBody.y) * 0.16;
      for (let n of p2.nodesList) { n.x += dx2; n.oldX += dx2; n.y += dy2; n.oldY += dy2; }

      if (p > 0.40) hugProgress = constrain(map(p, 0.40, 0.72, 0.0, 1.0), 0.0, 1.0);
    } else {
      p1.restX = targetX1;
      p2.restX = targetX2;
      let floorY1 = getBridgeArchY(p1.restX);
      let floorY2 = getBridgeArchY(p2.restX);

      p1.ctrls.head.x = p1.restX;
      p1.ctrls.head.y = floorY1 - 330 * sc + FINAL_HUG_POSE.heightOffset;
      p2.ctrls.head.x = p2.restX;
      p2.ctrls.head.y = floorY2 - 330 * sc + FINAL_HUG_POSE.heightOffset;

      p1.ctrls.lFoot.y = floorY1 - 20 * sc;
      p1.ctrls.rFoot.y = floorY1 - 20 * sc;
      p2.ctrls.lFoot.y = floorY2 - 20 * sc;
      p2.ctrls.rFoot.y = floorY2 - 20 * sc;

      hugProgress = 1.0;
    }
  } else {
    hugProgress = max(0.0, hugProgress - 0.04);
  }
}

function lockKeyframeHugPose(p1, p2) {
  if (!p1 || !p2 || !p1.nodes || !p2.nodes) return;
  if (hugProgress <= 0.001) {
    p1.armRot.frontLower = lerp(p1.armRot.frontLower, 0, 0.08);
    p2.armRot.frontLower = lerp(p2.armRot.frontLower, -10, 0.08);
    return;
  }

  let sc = 0.8;
  let midX = (p1.nodes.lowerBody.x + p2.nodes.lowerBody.x) * 0.5;
  let waistY = (p1.nodes.lowerBody.y + p2.nodes.lowerBody.y) * 0.5 + FINAL_HUG_POSE.heightOffset;

  let p = hugProgress;
  let easeT = 1 - pow(1 - p, 3);
  let popLift = sin(p * PI) * 5;

  let cfg = FINAL_HUG_POSE;
  let mX = midX - cfg.bodyOffset;
  let fX = midX + cfg.bodyOffset;

  let inHandY = waistY + cfg.inHandYOffset * sc;
  let inElbowY = waistY + cfg.inElbowYOffset * sc;

  let maleHandX = midX + cfg.male.handXOffset;
  let maleHandY = waistY + cfg.male.handYOffset * sc - popLift;
  let maleElbowX = mX + cfg.male.elbowXOffset * sc;
  let maleElbowY = waistY + cfg.male.elbowYOffset * sc - popLift * 0.5;

  let femaleHandX = midX + cfg.female.handXOffset;
  let femaleHandY = waistY + cfg.female.handYOffset * sc - popLift;
  let femaleElbowX = fX + cfg.female.elbowXOffset * sc;
  let femaleElbowY = waistY + cfg.female.elbowYOffset * sc - popLift * 0.5;

  let bodySpeed = 0.12 * easeT;
  p1.nodes.lowerBody.x = lerp(p1.nodes.lowerBody.x, mX, bodySpeed);
  p2.nodes.lowerBody.x = lerp(p2.nodes.lowerBody.x, fX, bodySpeed);
  p1.nodes.upperBody.x = lerp(p1.nodes.upperBody.x, mX, bodySpeed);
  p2.nodes.upperBody.x = lerp(p2.nodes.upperBody.x, fX, bodySpeed);

  p1.nodes.head.x = lerp(p1.nodes.head.x, mX + cfg.headTilt, bodySpeed);
  p2.nodes.head.x = lerp(p2.nodes.head.x, fX - cfg.headTilt, bodySpeed);

  let armSpeed = 0.14 * easeT;
  p1.nodes.lHand.x = lerp(p1.nodes.lHand.x, midX - cfg.inHandGap, armSpeed);
  p1.nodes.lHand.y = lerp(p1.nodes.lHand.y, inHandY, armSpeed);
  p2.nodes.lHand.x = lerp(p2.nodes.lHand.x, midX + cfg.inHandGap, armSpeed);
  p2.nodes.lHand.y = lerp(p2.nodes.lHand.y, inHandY, armSpeed);

  p1.nodes.lElbow.x = lerp(p1.nodes.lElbow.x, mX + 15 * sc, armSpeed);
  p1.nodes.lElbow.y = lerp(p1.nodes.lElbow.y, inElbowY, armSpeed);
  p2.nodes.lElbow.x = lerp(p2.nodes.lElbow.x, fX - 15 * sc, armSpeed);
  p2.nodes.lElbow.y = lerp(p2.nodes.lElbow.y, inElbowY, armSpeed);

  p1.nodes.rHand.x = lerp(p1.nodes.rHand.x, maleHandX, armSpeed);
  p1.nodes.rHand.y = lerp(p1.nodes.rHand.y, maleHandY, armSpeed);
  p1.nodes.rElbow.x = lerp(p1.nodes.rElbow.x, maleElbowX, armSpeed);
  p1.nodes.rElbow.y = lerp(p1.nodes.rElbow.y, maleElbowY, armSpeed);

  p2.nodes.rHand.x = lerp(p2.nodes.rHand.x, femaleHandX, armSpeed);
  p2.nodes.rHand.y = lerp(p2.nodes.rHand.y, femaleHandY, armSpeed);
  p2.nodes.rElbow.x = lerp(p2.nodes.rElbow.x, femaleElbowX, armSpeed);
  p2.nodes.rElbow.y = lerp(p2.nodes.rElbow.y, femaleElbowY, armSpeed);

  p1.armRot.frontLower = lerp(0, cfg.male.armAngle, easeT);
  p2.armRot.frontLower = lerp(-10, cfg.female.armAngle, easeT);

  if (hugProgress > 0.96) {
    p1.nodes.lHand.x = midX - cfg.inHandGap; p1.nodes.lHand.y = inHandY;
    p2.nodes.lHand.x = midX + cfg.inHandGap; p2.nodes.lHand.y = inHandY;
    p1.nodes.rHand.x = maleHandX;             p1.nodes.rHand.y = maleHandY;
    p1.nodes.rElbow.x = maleElbowX;          p1.nodes.rElbow.y = maleElbowY;
    p2.nodes.rHand.x = femaleHandX;          p2.nodes.rHand.y = femaleHandY;
    p2.nodes.rElbow.x = femaleElbowX;        p2.nodes.rElbow.y = femaleElbowY;

    let freezeList = [
      p1.nodes.lHand, p1.nodes.rHand, p1.nodes.lElbow, p1.nodes.rElbow,
      p2.nodes.lHand, p2.nodes.rHand, p2.nodes.lElbow, p2.nodes.rElbow,
      p1.nodes.upperBody, p2.nodes.upperBody, p1.nodes.head, p2.nodes.head
    ];
    for (let n of freezeList) { n.oldX = n.x; n.oldY = n.y; }
  }
}

function drawApproachStrings(p1, p2) {
  if (!p1 || !p2 || !p1.nodes || !p2.nodes) return;
  let d = dist(p1.nodes.lowerBody.x, p1.nodes.lowerBody.y, p2.nodes.lowerBody.x, p2.nodes.lowerBody.y);
  let maxDistance = 750;

  if (d < maxDistance) {
    let connections = [
      [p1.nodes.lHand, p2.nodes.lHand, 24],
      [p1.nodes.rHand, p2.nodes.rHand, 22],
      [p1.nodes.upperBody, p2.nodes.upperBody, 46],
      [p1.nodes.lHand, p2.nodes.rHand, 20],
      [p1.nodes.rHand, p2.nodes.lHand, 20],
      [p1.nodes.shoulder, p2.nodes.shoulder, 40],
      [p1.nodes.head, p2.nodes.head, 30],
      [p1.nodes.lElbow, p2.nodes.lElbow, 36],
      [p1.nodes.lowerBody, p2.nodes.lowerBody, 18]
    ];

    let numStrings = floor(map(d, maxDistance, 125, 1, connections.length));
    numStrings = constrain(numStrings, 1, connections.length);

    for (let i = 0; i < numStrings; i++) {
      let n1 = connections[i][0]; let n2 = connections[i][1]; let baseSag = connections[i][2];
      let alpha = map(d, maxDistance - (i * 35), 125, 0, 220, true);
      if (alpha > 0) drawStage1Silk(n1.x, n1.y, n2.x, n2.y, alpha, baseSag, i);
    }
  }
}

function drawStage1Silk(x1, y1, x2, y2, alphaVal, sagAmount, seed) {
  push();
  let midX = (x1 + x2) * 0.5;
  let midY = (y1 + y2) * 0.5;
  let time = frameCount * 0.025 + seed * 10;
  let twistX = sin(time * 0.9) * 16 * (seed % 2 === 0 ? 1 : -1);
  let twistY = cos(time * 0.7) * 8;
  let breatheSag = sagAmount + sin(time) * 5;

  let cx1 = lerp(x1, midX, 0.4) + twistX;
  let cy1 = lerp(y1, midY, 0.4) + breatheSag + twistY;
  let cx2 = lerp(x2, midX, 0.6) - twistX;
  let cy2 = lerp(y2, midY, 0.6) + breatheSag - twistY;

  noFill();
  strokeCap(ROUND); strokeJoin(ROUND);
  let f = alphaVal / 255.0;

  stroke(18, 2, 6, 85 * f);
  strokeWeight(3.6);
  bezier(x1, y1 + 2.5, cx1, cy1 + 2.5, cx2, cy2 + 2.5, x2, y2 + 2.5);

  stroke(245, 18, 38, 245 * f);
  strokeWeight(2.0);
  bezier(x1, y1, cx1, cy1, cx2, cy2, x2, y2);

  stroke(255, 65, 75, 210 * f);
  strokeWeight(1.0);
  bezier(x1, y1 - 0.4, cx1, cy1 - 0.4, cx2, cy2 - 0.4, x2, y2 - 0.4);

  stroke(255, 220, 150, 180 * f);
  strokeWeight(0.65);
  bezier(x1, y1 - 0.8, cx1, cy1 - 0.8, cx2, cy2 - 0.8, x2, y2 - 0.8);

  noStroke();
  fill(210, 20, 35, 235 * f);
  circle(x1, y1, 4.8);
  circle(x2, y2, 4.8);
  pop();
}

function drawBackWrapStrings(p1, p2) {
  if (!p1 || !p2 || !p1.nodes || !p2.nodes || hugProgress <= 0.05) return;
  let alphaVal = map(hugProgress, 0.05, 1.0, 0, 220);
  let time = frameCount * 0.03;
  let f = alphaVal / 255.0;

  push();
  noFill();
  strokeCap(ROUND); strokeJoin(ROUND);
  let loops = 4;
  for (let i = 0; i < loops; i++) {
    let tOffset = i * 0.25;
    let y1 = lerp(p1.nodes.upperBody.y - 10, p1.nodes.lowerBody.y + 25, tOffset);
    let y2 = lerp(p2.nodes.upperBody.y - 10, p2.nodes.lowerBody.y + 25, tOffset);
    let sag = 8 + sin(time + i) * 3;

    stroke(18, 2, 6, 75 * f);
    strokeWeight(3.4);
    bezier(p1.nodes.upperBody.x - 22, y1 + 2, p1.nodes.upperBody.x - 4, y1 + sag + 2, p2.nodes.upperBody.x + 4, y2 + sag + 2, p2.nodes.upperBody.x + 22, y2 + 2);

    stroke(245, 18, 38, 235 * f);
    strokeWeight(2.0);
    bezier(p1.nodes.upperBody.x - 22, y1, p1.nodes.upperBody.x - 4, y1 + sag, p2.nodes.upperBody.x + 4, y2 + sag, p2.nodes.upperBody.x + 22, y2);

    stroke(255, 65, 75, 190 * f);
    strokeWeight(1.0);
    bezier(p1.nodes.upperBody.x - 20, y1 - 0.4, p1.nodes.upperBody.x, y1 + sag - 0.4, p2.nodes.upperBody.x, y2 + sag - 0.4, p2.nodes.upperBody.x + 20, y2 - 0.4);
  }
  pop();
}

function drawFrontWrappedStrings(p1, p2) {
  if (!p1 || !p2 || !p1.nodes || !p2.nodes || hugProgress <= 0.05) return;
  let alphaVal = map(hugProgress, 0.05, 1.0, 0, 245);
  let time = frameCount * 0.035;
  let midX = (p1.nodes.lowerBody.x + p2.nodes.lowerBody.x) * 0.5;
  let waistY = (p1.nodes.lowerBody.y + p2.nodes.lowerBody.y) * 0.5 + FINAL_HUG_POSE.heightOffset;
  let claspY = waistY + FINAL_HUG_POSE.inHandYOffset * 0.8;
  let f = alphaVal / 255.0;

  push();
  noFill();
  strokeCap(ROUND); strokeJoin(ROUND);

  let helixCoils = 5;
  for (let i = 0; i < helixCoils; i++) {
    let coilY = lerp(p1.nodes.upperBody.y - 12, p1.nodes.lowerBody.y + 20, i / (helixCoils - 1));
    let wave = sin(time * 1.5 + i * 1.2) * 3;

    stroke(18, 2, 6, 80 * f);
    strokeWeight(3.4);
    bezier(p1.nodes.upperBody.x - 20, coilY - 2, midX - 10, coilY + 14 + wave, midX + 10, coilY + 14 + wave, p2.nodes.upperBody.x + 20, coilY - 2);

    stroke(245, 18, 38, 245 * f);
    strokeWeight(2.0);
    bezier(p1.nodes.upperBody.x - 20, coilY - 4, midX - 10, coilY + 12 + wave, midX + 10, coilY + 12 + wave, p2.nodes.upperBody.x + 20, coilY - 4);

    stroke(255, 65, 75, 200 * f);
    strokeWeight(1.0);
    bezier(p1.nodes.upperBody.x - 20, coilY - 4.4, midX - 10, coilY + 11.6 + wave, midX + 10, coilY + 11.6 + wave, p2.nodes.upperBody.x + 20, coilY - 4.4);

    if (i % 2 === 0) {
      stroke(255, 220, 150, 180 * f);
      strokeWeight(0.65);
      bezier(p1.nodes.upperBody.x - 18, coilY - 5, midX - 8, coilY + 10 + wave, midX + 8, coilY + 10 + wave, p2.nodes.upperBody.x + 18, coilY - 5);
    }
  }

  stroke(245, 18, 38, 235 * f);
  strokeWeight(1.8);
  bezier(p1.nodes.upperBody.x - 14, p1.nodes.upperBody.y + 10, midX - 12, waistY, midX + 12, waistY, p2.nodes.lowerBody.x + 16, p2.nodes.lowerBody.y + 5);
  bezier(p2.nodes.upperBody.x + 14, p2.nodes.upperBody.y + 10, midX + 12, waistY, midX - 12, waistY, p1.nodes.lowerBody.x - 16, p1.nodes.lowerBody.y + 5);

  for (let r = 0; r < 3; r++) {
    let loopR = 7 + r * 5;
    let waveR = sin(time * 2 + r) * 2;
    stroke(245, 18, 38, alphaVal * (0.9 - r * 0.2));
    strokeWeight(1.5);
    ellipse(midX, claspY, loopR * 2 + waveR, (loopR * 0.7) + waveR * 0.5);
  }
  fill(255, 220, 150, alphaVal);
  noStroke();
  circle(midX, claspY, 5.5);
  pop();
}

class Node {
  constructor(x, y, radius = 6) {
    this.x = x; this.y = y; this.oldX = x; this.oldY = y; this.radius = radius;
  }
  update() {
    let vx = constrain((this.x - this.oldX) * 0.88, -12, 12);
    let vy = constrain((this.y - this.oldY) * 0.88, -12, 12);
    this.oldX = this.x;
    this.oldY = this.y;
    this.x += vx;
    this.y += vy + 0.45;
  }
}

class Stick {
  constructor(n1, n2) {
    this.n1 = n1; this.n2 = n2; this.length = dist(n1.x, n1.y, n2.x, n2.y);
  }
  solve() {
    let dx = this.n2.x - this.n1.x; let dy = this.n2.y - this.n1.y;
    let distance = sqrt(dx * dx + dy * dy);
    if (distance === 0) return;
    let diff = (this.length - distance) / distance * 0.5;
    let offsetX = dx * diff; let offsetY = dy * diff;
    this.n1.x -= offsetX; this.n1.y -= offsetY;
    this.n2.x += offsetX; this.n2.y += offsetY;
  }
}

class StringConstraint {
  constructor(controller, node, length) {
    this.controller = controller; this.node = node; this.length = length;
  }
  solve() {
    let dx = this.node.x - this.controller.x; let dy = this.node.y - this.controller.y;
    let distVal = Math.sqrt(dx * dx + dy * dy);
    if (distVal > this.length) {
      let diff = (this.length - distVal) / distVal;
      this.node.x += dx * diff; this.node.y += dy * diff;
    }
  }
  display() {
    let dx = this.node.x - this.controller.x; let dy = this.node.y - this.controller.y;
    let distVal = Math.sqrt(dx * dx + dy * dy);
    noFill();
    if (distVal < this.length - 2) {
      let sag = (this.length - distVal) * 0.38;
      let midX = (this.controller.x + this.node.x) * 0.5;
      let midY = (this.controller.y + this.node.y) * 0.5 + sag;
      stroke(240, 240, 245, 40);
      strokeWeight(1.8);
      bezier(this.controller.x, this.controller.y, this.controller.x, this.controller.y + sag * 0.6, midX, midY, this.node.x, this.node.y);
      stroke(255, 255, 255, 85);
      strokeWeight(0.9);
      bezier(this.controller.x, this.controller.y, this.controller.x, this.controller.y + sag * 0.6, midX, midY, this.node.x, this.node.y);
    } else {
      let vib = sin(frameCount * 0.4 + this.node.x * 0.1) * 0.7;
      stroke(240, 240, 245, 45);
      strokeWeight(1.8);
      line(this.controller.x, this.controller.y, this.node.x + vib, this.node.y);
      stroke(255, 255, 255, 95);
      strokeWeight(0.9);
      line(this.controller.x, this.controller.y, this.node.x + vib, this.node.y);
    }
  }
}

class MalePuppet {
  constructor(anchorX, handSide) {
    this.anchorX = anchorX; this.restX = anchorX; this.handSide = handSide;
    let sc = 0.8; this.scaleVal = 0.2 * sc;
    let spawnFloorY = getBridgeArchY(anchorX);
    let anchorY = spawnFloorY - 118 * sc;

    this.headNodeShift  = { x: -5 * sc, y: 48 * sc };
    this.upperNodeShift = { x: 0,        y: 50 * sc };
    this.shoulderShift  = { x: 0,        y: 0 };
    this.lowerNodeShift = { x: 10 * sc, y: 40 * sc };

    this.lElbowShift = { x: 0, y: 0 }; this.lHandShift = { x: 0, y: 0 };
    this.rElbowShift = { x: 0, y: 0 }; this.rHandShift = { x: 0, y: 0 };
    this.lFootShift = { x: 0, y: 10 * sc }; this.rFootShift = { x: 0, y: 10 * sc };

    this.armRot = { backUpper: 0, backLower: 0, frontUpper: 0, frontLower: 0, lLeg: 0, rLeg: 0 };
    this.assetOffset = {
      head: { x: -5 * sc, y: 18 * sc }, upperBody: { x: 0, y: 0 }, lowerBody: { x: 5 * sc, y: 5 * sc },
      backUpper: { x: -10 * sc, y: -10 * sc }, backLower: { x: -15 * sc, y: 0 },
      frontUpper: { x: -10 * sc, y: -10 * sc }, frontLower: { x: -20 * sc, y: 0 },
      lLeg: { x: 0, y: 70 * sc }, rLeg: { x: 0, y: 70 * sc }
    };

    let upperX = this.anchorX + this.upperNodeShift.x;
    let upperY = anchorY - 165 * sc + this.upperNodeShift.y;
    let upperNode = new Node(upperX, upperY);
    let shoulderNode = new Node(upperX - 10 * sc + this.shoulderShift.x, upperY + 20 * sc + this.shoulderShift.y);

    this.nodes = {
      head: new Node(this.anchorX - 6 * sc + this.headNodeShift.x, anchorY - 210 * sc + this.headNodeShift.y),
      upperBody: upperNode, 
      shoulder: shoulderNode,
      lowerBody: new Node(this.anchorX + 6 * sc + this.lowerNodeShift.x, anchorY - 50 * sc + this.lowerNodeShift.y),
      lElbow: new Node(this.anchorX - 35 * sc + this.lElbowShift.x, anchorY - 30 * sc + this.lElbowShift.y),
      rElbow: new Node(this.anchorX + 25 * sc + this.rElbowShift.x, anchorY - 25 * sc + this.rElbowShift.y),
      lHand: new Node(this.anchorX - 15 * sc + this.lHandShift.x, anchorY + 25 * sc + this.lHandShift.y),
      rHand: new Node(this.anchorX + 10 * sc + this.rHandShift.x, anchorY + 25 * sc + this.rHandShift.y),
      lFoot: new Node(this.anchorX - 25 * sc + this.lFootShift.x, anchorY + 120 * sc + this.lFootShift.y),
      rFoot: new Node(this.anchorX + 15 * sc + this.rFootShift.x, anchorY + 120 * sc + this.rFootShift.y)
    };

    this.shoulderOffsetX = this.nodes.shoulder.x - this.nodes.upperBody.x;
    this.shoulderOffsetY = this.nodes.shoulder.y - this.nodes.upperBody.y;
    this.neckLength = dist(this.nodes.head.x, this.nodes.head.y, this.nodes.upperBody.x, this.nodes.upperBody.y);
    this.spineLength = dist(this.nodes.upperBody.x, this.nodes.upperBody.y, this.nodes.lowerBody.x, this.nodes.lowerBody.y);
    this.neutralHeadAngleDiff = atan2(this.nodes.head.y - this.nodes.upperBody.y, this.nodes.head.x - this.nodes.upperBody.x) - atan2(this.nodes.upperBody.y - this.nodes.lowerBody.y, this.nodes.upperBody.x - this.nodes.lowerBody.x);

    this.nodesList = Object.values(this.nodes);
    this.bones = [
      new Stick(this.nodes.head, this.nodes.upperBody), new Stick(this.nodes.upperBody, this.nodes.lowerBody),
      new Stick(this.nodes.upperBody, this.nodes.shoulder), new Stick(this.nodes.head, this.nodes.shoulder),
      new Stick(this.nodes.shoulder, this.nodes.lElbow), new Stick(this.nodes.lElbow, this.nodes.lHand),
      new Stick(this.nodes.shoulder, this.nodes.rElbow), new Stick(this.nodes.rElbow, this.nodes.rHand),
      new Stick(this.nodes.lowerBody, this.nodes.lFoot), new Stick(this.nodes.lowerBody, this.nodes.rFoot)
    ];

    let startY = anchorY - 220 * sc;
    this.ctrls = {
      lHand: { x: anchorX - 35 * sc, y: startY + 80 * sc }, rHand: { x: anchorX + 35 * sc, y: startY + 80 * sc },
      head: { x: anchorX, y: startY }, lFoot: { x: anchorX - 25 * sc, y: startY + 160 * sc }, rFoot: { x: anchorX + 25 * sc, y: startY + 160 * sc }
    };
    this.strings = [
      new StringConstraint(this.ctrls.lHand, this.nodes.lHand, 270 * sc), new StringConstraint(this.ctrls.rHand, this.nodes.rHand, 270 * sc),
      new StringConstraint(this.ctrls.head, this.nodes.upperBody, 130 * sc), new StringConstraint(this.ctrls.lFoot, this.nodes.lFoot, 390 * sc),
      new StringConstraint(this.ctrls.rFoot, this.nodes.rFoot, 390 * sc)
    ];

    this.severed = {
      head: false, upperBody: false, lowerBody: false,
      frontLowerArm: false, frontUpperArm: false,
      backLowerArm: false, backUpperArm: false, lLeg: false, rLeg: false
    };
    this.hitCounts = { head: 0, upperBody: 0, lowerBody: 0, frontLowerArm: 0, backLowerArm: 0, lLeg: 0, rLeg: 0 };
    this.partCooldown = 0;
  }

  updateControls(hands) {
    let sc = 0.8;
    if (currentStage === 1) {
      if (curtainState !== "IDLE" || isAutoFlying) return;
      let myHand = null;
      if (hands.length === 1) {
        if (hands[0].keypoints[0].x < VIDEO_W * 0.58) myHand = hands[0];
      } else if (hands.length >= 2) {
        let sorted = [...hands].sort((a, b) => a.keypoints[0].x - b.keypoints[0].x);
        myHand = sorted[0];
      }

      if (myHand) {
        userInteractedInStage1 = true;
        let wrist = myHand.keypoints[0];
        let targetStageX = map(wrist.x, VIDEO_W * 0.08, VIDEO_W * 0.92, width * 0.06, width * 0.94);
        this.restX = targetStageX;
        let bridgeHump = getBridgeArchY(targetStageX) - height * 0.82;
        let targetStageY = map(wrist.y, VIDEO_H * 0.1, VIDEO_H * 0.9, height * 0.44, height * 0.62) + bridgeHump;
        let spreadScale = 1.8;

        let applyFinger = (ctrl, fingerId, offsetX = 0, offsetY = 0) => {
          let finger = myHand.keypoints[fingerId];
          let tx = targetStageX + (finger.x - wrist.x) * spreadScale + offsetX;
          let ty = targetStageY + (finger.y - wrist.y) * spreadScale + offsetY;
          ctrl.x = lerp(ctrl.x, tx, 0.15); ctrl.y = lerp(ctrl.y, ty, 0.15);
        };
        applyFinger(this.ctrls.rHand, 8, 30, 40); applyFinger(this.ctrls.lHand, 4, -30, 40);
        applyFinger(this.ctrls.head, 12, 0, 0); applyFinger(this.ctrls.lFoot, 16, -25, 40); applyFinger(this.ctrls.rFoot, 20, 25, 40);
      } else {
        let targetX = this.restX;
        let archFloorY = getBridgeArchY(targetX);
        let restCtrlY = archFloorY - 330 * sc;

        this.ctrls.head.x  = lerp(this.ctrls.head.x,  targetX, 0.05);
        this.ctrls.head.y  = lerp(this.ctrls.head.y,  restCtrlY, 0.05);
        let armSpread = 22 * sc;
        this.ctrls.lHand.x = lerp(this.ctrls.lHand.x, targetX - armSpread, 0.05);
        this.ctrls.lHand.y = lerp(this.ctrls.lHand.y, restCtrlY + 110 * sc, 0.05);
        this.ctrls.rHand.x = lerp(this.ctrls.rHand.x, targetX + armSpread, 0.05);
        this.ctrls.rHand.y = lerp(this.ctrls.rHand.y, restCtrlY + 110 * sc, 0.05);
        this.ctrls.lFoot.x = lerp(this.ctrls.lFoot.x, targetX - 18 * sc, 0.05);
        this.ctrls.lFoot.y = lerp(this.ctrls.lFoot.y, archFloorY - 20 * sc, 0.05);
        this.ctrls.rFoot.x = lerp(this.ctrls.rFoot.x, targetX + 18 * sc, 0.05);
        this.ctrls.rFoot.y = lerp(this.ctrls.rFoot.y, archFloorY - 20 * sc, 0.05);
      }
    } else if (currentStage === 2) {
      let targetX = this.nodes.lowerBody.x;
      let groundFloorY = height * STAGE2_GROUND_Y_RATIO + 20 * sc;
      let restCtrlY = groundFloorY - 330 * sc;

      this.ctrls.head.x  = lerp(this.ctrls.head.x,  targetX - 6 * sc, 0.12);
      this.ctrls.head.y  = lerp(this.ctrls.head.y,  restCtrlY, 0.12);
      let armSpread = 22 * sc;
      this.ctrls.lHand.x = lerp(this.ctrls.lHand.x, targetX - armSpread, 0.12);
      this.ctrls.lHand.y = lerp(this.ctrls.lHand.y, restCtrlY + 110 * sc, 0.12);
      this.ctrls.rHand.x = lerp(this.ctrls.rHand.x, targetX + armSpread, 0.12);
      this.ctrls.rHand.y = lerp(this.ctrls.rHand.y, restCtrlY + 110 * sc, 0.12);
      this.ctrls.lFoot.x = lerp(this.ctrls.lFoot.x, targetX - 18 * sc, 0.12);
      this.ctrls.lFoot.y = min(lerp(this.ctrls.lFoot.y, groundFloorY - 20 * sc, 0.12), groundFloorY);
      this.ctrls.rFoot.x = lerp(this.ctrls.rFoot.x, targetX + 18 * sc, 0.12);
      this.ctrls.rFoot.y = min(lerp(this.ctrls.rFoot.y, groundFloorY - 20 * sc, 0.12), groundFloorY);
    } else if (currentStage === 3) {
      let targetX = this.restX;
      let groundFloorY = height * STAGE2_GROUND_Y_RATIO;
      let restCtrlY = groundFloorY - 340 * sc;

      let t = frameCount * 0.04;
      let swayX = sin(t + 0.5) * 4;
      let swayY = cos(t * 1.3) * 2;

      this.ctrls.head.x = lerp(this.ctrls.head.x, targetX + swayX, 0.08);
      this.ctrls.head.y = lerp(this.ctrls.head.y, restCtrlY + swayY, 0.08);

      let armSpread = 20 * sc;
      this.ctrls.lHand.x = lerp(this.ctrls.lHand.x, targetX - armSpread + swayX * 0.8, 0.08);
      this.ctrls.lHand.y = lerp(this.ctrls.lHand.y, restCtrlY + 118 * sc + swayY, 0.08);
      this.ctrls.rHand.x = lerp(this.ctrls.rHand.x, targetX + armSpread + swayX * 0.8, 0.08);
      this.ctrls.rHand.y = lerp(this.ctrls.rHand.y, restCtrlY + 118 * sc + swayY, 0.08);

      this.ctrls.lFoot.x = lerp(this.ctrls.lFoot.x, targetX - 18 * sc + swayX * 0.5, 0.08);
      this.ctrls.lFoot.y = lerp(this.ctrls.lFoot.y, groundFloorY - 20 * sc, 0.08);
      this.ctrls.rFoot.x = lerp(this.ctrls.rFoot.x, targetX + 18 * sc + swayX * 0.5, 0.08);
      this.ctrls.rFoot.y = lerp(this.ctrls.rFoot.y, groundFloorY - 20 * sc, 0.08);
    }
  }

  updatePhysics() {
    let sc = 0.8;
    for (let node of this.nodesList) if (node) node.update();

    for (let i = 0; i < 16; i++) {
      for (let bone of this.bones) {
        if (!bone) continue;
        if (currentStage === 1 && hugProgress > 0.35 && (bone.n1 === this.nodes.rHand || bone.n2 === this.nodes.rHand || bone.n1 === this.nodes.rElbow || bone.n2 === this.nodes.rElbow)) {
          continue;
        }
        bone.solve();
      }

      for (let str of this.strings) {
        if (!str) continue;
        if (currentStage === 2) continue;
        if (currentStage === 1 && hugProgress > 0.35 && str.node === this.nodes.rHand) continue;
        str.solve();
      }

      if (this.nodes.upperBody.y > this.nodes.lowerBody.y - 25 * sc) {
        let correction = (this.nodes.lowerBody.y - 25 * sc) - this.nodes.upperBody.y;
        this.nodes.upperBody.y += correction * 0.5; this.nodes.lowerBody.y -= correction * 0.5;
      }

      let curSpine = atan2(this.nodes.upperBody.y - this.nodes.lowerBody.y, this.nodes.upperBody.x - this.nodes.lowerBody.x);
      let leanOffset = curSpine - (-HALF_PI);
      while (leanOffset > PI) leanOffset -= TWO_PI; while (leanOffset < -PI) leanOffset += TWO_PI;
      if (abs(leanOffset) > 0.55) this.nodes.upperBody.x -= ((abs(leanOffset) - 0.55) * Math.sign(leanOffset)) * this.spineLength * 0.12;

      this.nodes.shoulder.x = this.nodes.upperBody.x + this.shoulderOffsetX;
      this.nodes.shoulder.y = this.nodes.upperBody.y + this.shoulderOffsetY;

      let maxFlare = 70 * sc;
      this.nodes.lFoot.x = constrain(this.nodes.lFoot.x, this.nodes.lowerBody.x - maxFlare, this.nodes.lowerBody.x + maxFlare);
      this.nodes.rFoot.x = constrain(this.nodes.rFoot.x, this.nodes.lowerBody.x - maxFlare, this.nodes.lowerBody.x + maxFlare);
      if (this.nodes.lFoot.y < this.nodes.lowerBody.y + 15 * sc) this.nodes.lFoot.y = this.nodes.lowerBody.y + 15 * sc;
      if (this.nodes.rFoot.y < this.nodes.lowerBody.y + 15 * sc) this.nodes.rFoot.y = this.nodes.lowerBody.y + 15 * sc;

      let spineAngle = atan2(this.nodes.upperBody.y - this.nodes.lowerBody.y, this.nodes.upperBody.x - this.nodes.lowerBody.x);
      let currentHeadAngle = atan2(this.nodes.head.y - this.nodes.upperBody.y, this.nodes.head.x - this.nodes.upperBody.x);
      let diff = currentHeadAngle - spineAngle - this.neutralHeadAngleDiff;
      while (diff > PI) diff -= TWO_PI; while (diff < -PI) diff += TWO_PI;
      if (abs(diff) > 0.08) {
        diff = constrain(diff, -0.08, 0.08);
        let clampedAngle = spineAngle + this.neutralHeadAngleDiff + diff;
        this.nodes.head.x = this.nodes.upperBody.x + cos(clampedAngle) * this.neckLength;
        this.nodes.head.y = this.nodes.upperBody.y + sin(clampedAngle) * this.neckLength;
      }

      for (let n of this.nodesList) {
        if (n) { n.x = constrain(n.x, 20, width - 20); n.y = constrain(n.y, height * 0.05, height - 15); }
      }
    }
  }

  drawSegmentImage(startNode, endNode, img, scaleVal, overlap = 8, angleOffset = 0, offX = 0, offY = 0) {
    if (!img) return;
    let w = img.width * scaleVal; let h = img.height * scaleVal;
    let angle = atan2(endNode.y - startNode.y, endNode.x - startNode.x);
    push();
    translate(startNode.x, startNode.y);
    rotate(angle - HALF_PI + angleOffset);
    if (currentStage === 3) scale(-1, 1);
    imageMode(CENTER);
    image(img, offX, h / 2 - overlap + offY, w, h);
    pop();
  }

  displayStrings() {
    for (let str of this.strings) if (str) str.display();
  }

  displayBackArm() {
    let s = this.scaleVal; let sc = 0.8;
    if (!this.severed.backUpperArm) {
      this.drawSegmentImage(this.nodes.shoulder, this.nodes.lElbow, imgMaleUpperArm, s, 8 * sc, radians(this.armRot.backUpper), this.assetOffset.backUpper.x, this.assetOffset.backUpper.y);
    }
    if (!this.severed.backLowerArm) {
      this.drawSegmentImage(this.nodes.lElbow, this.nodes.lHand, imgMaleLowerArmWithin, s, 8 * sc, radians(this.armRot.backLower), this.assetOffset.backLower.x, this.assetOffset.backLower.y);
    }
  }

  displayBody() {
    let s = this.scaleVal; let sc = 0.8;
    imageMode(CENTER);
    if (imgMaleLeg) {
      if (!this.severed.lLeg) this.drawSegmentImage(this.nodes.lowerBody, this.nodes.lFoot, imgMaleLeg, s, 10 * sc, radians(this.armRot.lLeg), this.assetOffset.lLeg.x, this.assetOffset.lLeg.y);
      if (!this.severed.rLeg) this.drawSegmentImage(this.nodes.lowerBody, this.nodes.rFoot, imgMaleLeg, s, 10 * sc, radians(this.armRot.rLeg), this.assetOffset.rLeg.x, this.assetOffset.rLeg.y);
    }
    if (imgMaleLowerBody && !this.severed.lowerBody) {
      push(); translate(this.nodes.lowerBody.x, this.nodes.lowerBody.y);
      let spineAngle = atan2(this.nodes.lowerBody.y - this.nodes.upperBody.y, this.nodes.lowerBody.x - this.nodes.upperBody.x);
      let legAngle = atan2((this.nodes.lFoot.y + this.nodes.rFoot.y)*0.5 - this.nodes.lowerBody.y, (this.nodes.lFoot.x + this.nodes.rFoot.x)*0.5 - this.nodes.lowerBody.x);
      let deltaAngle = legAngle - spineAngle;
      while (deltaAngle > PI) deltaAngle -= TWO_PI; while (deltaAngle < -PI) deltaAngle += TWO_PI;
      rotate((spineAngle + deltaAngle * 0.8) - HALF_PI);
      if (currentStage === 3) scale(-1, 1);
      image(imgMaleLowerBody, -this.lowerNodeShift.x + this.assetOffset.lowerBody.x, imgMaleLowerBody.height * s / 2 - this.lowerNodeShift.y + this.assetOffset.lowerBody.y, imgMaleLowerBody.width * s, imgMaleLowerBody.height * s);
      pop();
    }
    if (imgMaleUpperBody && !this.severed.upperBody) {
      push(); translate(this.nodes.upperBody.x, this.nodes.upperBody.y);
      rotate(atan2(this.nodes.upperBody.y - this.nodes.lowerBody.y, this.nodes.upperBody.x - this.nodes.lowerBody.x) + HALF_PI);
      if (currentStage === 3) scale(-1, 1);
      image(imgMaleUpperBody, -this.upperNodeShift.x + this.assetOffset.upperBody.x, imgMaleUpperBody.height * s / 2 - this.upperNodeShift.y + this.assetOffset.upperBody.y, imgMaleUpperBody.width * s, imgMaleUpperBody.height * s);
      pop();
    }
    if (imgMaleHead && !this.severed.head) {
      push(); translate(this.nodes.head.x - this.headNodeShift.x, this.nodes.head.y - this.headNodeShift.y);
      rotate(atan2(this.nodes.head.y - this.headNodeShift.y - this.nodes.upperBody.y, this.nodes.head.x - this.headNodeShift.x - this.nodes.upperBody.x) + HALF_PI);
      if (currentStage === 3) scale(-1, 1);
      image(imgMaleHead, this.assetOffset.head.x, 15 * sc + this.assetOffset.head.y, imgMaleHead.width * s, imgMaleHead.height * s);
      pop();
    }
  }

  displayFrontArm() {
    let s = this.scaleVal; let sc = 0.8;
    if (!this.severed.frontUpperArm) {
      this.drawSegmentImage(this.nodes.shoulder, this.nodes.rElbow, imgMaleUpperArm, s, 8 * sc, radians(this.armRot.frontUpper), this.assetOffset.frontUpper.x, this.assetOffset.frontUpper.y);
    }
    if (!this.severed.frontLowerArm) {
      this.drawSegmentImage(this.nodes.rElbow, this.nodes.rHand, imgMaleLowerArmOuter, s, 8 * sc, radians(this.armRot.frontLower), this.assetOffset.frontLower.x, this.assetOffset.frontLower.y);
    }
  }
}

class FemalePuppet {
  constructor(anchorX, handSide) {
    this.anchorX = anchorX; this.restX = anchorX; this.handSide = handSide;
    let sc = 0.8; 
    this.baseScaleVal = 0.2 * sc;
    this.scaleVal = this.baseScaleVal;
    let spawnFloorY = getBridgeArchY(anchorX);
    let anchorY = spawnFloorY - 118 * sc;

    this.headNodeShift  = { x: 5 * sc,   y: 25 * sc };
    this.upperNodeShift = { x: 0,        y: 50 * sc };
    this.shoulderShift  = { x: 0,        y: -30 * sc };
    this.lowerNodeShift = { x: 0,        y: 100 * sc };

    this.lElbowShift = { x: 0, y: 0 }; this.lHandShift = { x: 0, y: 0 };
    this.rElbowShift = { x: 0, y: 0 }; this.rHandShift = { x: 0, y: 0 };
    this.lFootShift = { x: 18 * sc, y: 0 }; this.rFootShift = { x: -18 * sc, y: 0 };

    this.armRot = { backUpper: 0, backLower: -10, frontUpper: 0, frontLower: -10, lLeg: 0, rLeg: 0 };
    this.assetOffset = {
      head: { x: 8 * sc, y: 15 * sc }, upperBody: { x: 0, y: 0 }, lowerBody: { x: 15 * sc, y: 65 * sc },
      backUpper: { x: 0, y: 0 }, backLower: { x: -25 * sc, y: 0 },
      frontUpper: { x: 0, y: 0 }, frontLower: { x: -25 * sc, y: 0 },
      lLeg: { x: 0, y: 35 * sc }, rLeg: { x: 0, y: 35 * sc }
    };

    let upperX = this.anchorX + this.upperNodeShift.x; 
    let upperY = anchorY - 165 * sc + this.upperNodeShift.y;
    let upperNode = new Node(upperX, upperY);
    let shoulderNode = new Node(upperX + this.shoulderShift.x, upperY + 35 * sc + this.shoulderShift.y);

    this.nodes = {
      head: new Node(this.anchorX + this.headNodeShift.x, anchorY - 195 * sc + this.headNodeShift.y),
      upperBody: upperNode, 
      shoulder: shoulderNode,
      lowerBody: new Node(this.anchorX - 5 * sc + this.lowerNodeShift.x, anchorY - 60 * sc + this.lowerNodeShift.y),
      lElbow: new Node(this.anchorX + 35 * sc + this.lElbowShift.x, anchorY - 30 * sc + this.lElbowShift.y),
      lHand: new Node(this.anchorX + 45 * sc + this.lHandShift.x, anchorY + 30 * sc + this.lHandShift.y),
      rElbow: new Node(this.anchorX - 25 * sc + this.rElbowShift.x, anchorY - 25 * sc + this.rElbowShift.y),
      rHand: new Node(this.anchorX - 45 * sc + this.rHandShift.x, anchorY + 30 * sc + this.rHandShift.y),
      lFoot: new Node(this.anchorX + 20 * sc + this.lFootShift.x, anchorY + 120 * sc + this.lFootShift.y),
      rFoot: new Node(this.anchorX - 20 * sc + this.rFootShift.x, anchorY + 120 * sc + this.rFootShift.y)
    };

    this.shoulderOffsetX = this.nodes.shoulder.x - this.nodes.upperBody.x;
    this.shoulderOffsetY = this.nodes.shoulder.y - this.nodes.upperBody.y;
    this.neckLength = dist(this.nodes.head.x, this.nodes.head.y, this.nodes.upperBody.x, this.nodes.upperBody.y);
    this.spineLength = dist(this.nodes.upperBody.x, this.nodes.upperBody.y, this.nodes.lowerBody.x, this.nodes.lowerBody.y);
    this.neutralHeadAngleDiff = atan2(this.nodes.head.y - this.nodes.upperBody.y, this.nodes.head.x - this.nodes.upperBody.x) - atan2(this.nodes.upperBody.y - this.nodes.lowerBody.y, this.nodes.upperBody.x - this.nodes.lowerBody.x);
    this.baseNeutralHead = this.neutralHeadAngleDiff;

    this.nodesList = Object.values(this.nodes);
    this.bones = [
      new Stick(this.nodes.head, this.nodes.upperBody), new Stick(this.nodes.upperBody, this.nodes.lowerBody),
      new Stick(this.nodes.upperBody, this.nodes.shoulder), new Stick(this.nodes.head, this.nodes.shoulder),
      new Stick(this.nodes.shoulder, this.nodes.lElbow), new Stick(this.nodes.lElbow, this.nodes.lHand),
      new Stick(this.nodes.shoulder, this.nodes.rElbow), new Stick(this.nodes.rElbow, this.nodes.rHand),
      new Stick(this.nodes.lowerBody, this.nodes.lFoot), new Stick(this.nodes.lowerBody, this.nodes.rFoot)
    ];

    let startY = anchorY - 220 * sc;
    this.ctrls = {
      lHand: { x: anchorX + 35 * sc, y: startY + 80 * sc }, rHand: { x: anchorX - 35 * sc, y: startY + 80 * sc },
      head: { x: anchorX, y: startY }, lFoot: { x: anchorX + 35 * sc, y: startY + 160 * sc }, rFoot: { x: anchorX - 35 * sc, y: startY + 160 * sc }
    };
    this.strings = [
      new StringConstraint(this.ctrls.lHand, this.nodes.lHand, 270 * sc), new StringConstraint(this.ctrls.rHand, this.nodes.rHand, 270 * sc),
      new StringConstraint(this.ctrls.head, this.nodes.upperBody, 135 * sc), new StringConstraint(this.ctrls.lFoot, this.nodes.lFoot, 390 * sc),
      new StringConstraint(this.ctrls.rFoot, this.nodes.rFoot, 390 * sc)
    ];

    this.severed = {
      head: false, upperBody: false, lowerBody: false,
      frontLowerArm: false, frontUpperArm: false,
      backLowerArm: false, backUpperArm: false, lLeg: false, rLeg: false
    };
    this.hitCounts = { head: 0, upperBody: 0, lowerBody: 0, frontLowerArm: 0, backLowerArm: 0, lLeg: 0, rLeg: 0 };
    this.partCooldown = 0;
  }

  updateControls(hands) {
    let sc = 0.8;
    if (currentStage === 1) {
      if (isAutoFlying) return;
      let myHand = null;
      if (hands.length === 1) {
        if (hands[0].keypoints[0].x >= VIDEO_W * 0.42) myHand = hands[0];
      } else if (hands.length >= 2) {
        let sorted = [...hands].sort((a, b) => a.keypoints[0].x - b.keypoints[0].x);
        myHand = sorted[sorted.length - 1];
      }

      if (myHand) {
        userInteractedInStage1 = true;
        let wrist = myHand.keypoints[0];
        let targetStageX = map(wrist.x, VIDEO_W * 0.08, VIDEO_W * 0.92, width * 0.06, width * 0.94);
        this.restX = targetStageX;
        let bridgeHump = getBridgeArchY(targetStageX) - height * 0.82;
        let targetStageY = map(wrist.y, VIDEO_H * 0.1, VIDEO_H * 0.9, height * 0.44, height * 0.62) + bridgeHump;
        let spreadScale = 1.8;

        let applyFinger = (ctrl, fingerId, offsetX = 0, offsetY = 0) => {
          let finger = myHand.keypoints[fingerId];
          let tx = targetStageX + (finger.x - wrist.x) * spreadScale + offsetX;
          let ty = targetStageY + (finger.y - wrist.y) * spreadScale + offsetY;
          ctrl.x = lerp(ctrl.x, tx, 0.15); ctrl.y = lerp(ctrl.y, ty, 0.15);
        };
        applyFinger(this.ctrls.rHand, 8, -30, 40); applyFinger(this.ctrls.lHand, 4, 30, 40);
        applyFinger(this.ctrls.head, 12, 0, 0); applyFinger(this.ctrls.rFoot, 16, -30, 40); applyFinger(this.ctrls.lFoot, 20, 30, 40);
      } else {
        let targetX = this.restX;
        let archFloorY = getBridgeArchY(targetX);
        let restCtrlY = archFloorY - 330 * sc;

        this.ctrls.head.x  = lerp(this.ctrls.head.x,  targetX, 0.05);
        this.ctrls.head.y  = lerp(this.ctrls.head.y,  restCtrlY, 0.05);
        let armSpread = 22 * sc;
        this.ctrls.lHand.x = lerp(this.ctrls.lHand.x, targetX + armSpread, 0.05);
        this.ctrls.lHand.y = lerp(this.ctrls.lHand.y, restCtrlY + 110 * sc, 0.05);
        this.ctrls.rHand.x = lerp(this.ctrls.rHand.x, targetX - armSpread, 0.05);
        this.ctrls.rHand.y = lerp(this.ctrls.rHand.y, restCtrlY + 110 * sc, 0.05);
        this.ctrls.lFoot.x = lerp(this.ctrls.lFoot.x, targetX + 18 * sc, 0.05);
        this.ctrls.lFoot.y = lerp(this.ctrls.lFoot.y, archFloorY - 20 * sc, 0.05);
        this.ctrls.rFoot.x = lerp(this.ctrls.rFoot.x, targetX - 18 * sc, 0.05);
        this.ctrls.rFoot.y = lerp(this.ctrls.rFoot.y, archFloorY - 20 * sc, 0.05);
      }
    } else if (currentStage === 2) {
      let targetX = this.nodes.lowerBody.x;
      let groundFloorY = height * STAGE2_GROUND_Y_RATIO + 20 * sc;
      let restCtrlY = groundFloorY - 330 * sc;

      this.ctrls.head.x  = lerp(this.ctrls.head.x,  targetX - 6 * sc, 0.12);
      this.ctrls.head.y  = lerp(this.ctrls.head.y,  restCtrlY, 0.12);
      let armSpread = 22 * sc;
      this.ctrls.lHand.x = lerp(this.ctrls.lHand.x, targetX - armSpread, 0.12);
      this.ctrls.lHand.y = lerp(this.ctrls.lHand.y, restCtrlY + 110 * sc, 0.12);
      this.ctrls.rHand.x = lerp(this.ctrls.rHand.x, targetX + armSpread, 0.12);
      this.ctrls.rHand.y = lerp(this.ctrls.rHand.y, restCtrlY + 110 * sc, 0.12);
      this.ctrls.lFoot.x = lerp(this.ctrls.lFoot.x, targetX - 18 * sc, 0.12);
      this.ctrls.lFoot.y = min(lerp(this.ctrls.lFoot.y, groundFloorY - 20 * sc, 0.12), groundFloorY);
      this.ctrls.rFoot.x = lerp(this.ctrls.rFoot.x, targetX + 18 * sc, 0.12);
      this.ctrls.rFoot.y = min(lerp(this.ctrls.rFoot.y, groundFloorY - 20 * sc, 0.12), groundFloorY);
    } else if (currentStage === 3) {
      let targetX = this.restX;
      let groundFloorY = height * STAGE2_GROUND_Y_RATIO;
      let restCtrlY = groundFloorY - 340 * sc;

      let t = frameCount * 0.04;
      let swayX = cos(t) * 4;
      let swayY = sin(t * 1.3) * 2;

      this.ctrls.head.x = lerp(this.ctrls.head.x, targetX + swayX, 0.08);
      this.ctrls.head.y = lerp(this.ctrls.head.y, restCtrlY + swayY, 0.08);

      let armSpread = 20 * sc;
      this.ctrls.lHand.x = lerp(this.ctrls.lHand.x, targetX + armSpread + swayX * 0.8, 0.08);
      this.ctrls.lHand.y = lerp(this.ctrls.lHand.y, restCtrlY + 118 * sc + swayY, 0.08);
      this.ctrls.rHand.x = lerp(this.ctrls.rHand.x, targetX - armSpread + swayX * 0.8, 0.08);
      this.ctrls.rHand.y = lerp(this.ctrls.rHand.y, restCtrlY + 118 * sc + swayY, 0.08);

      this.ctrls.lFoot.x = lerp(this.ctrls.lFoot.x, targetX + 18 * sc + swayX * 0.5, 0.08);
      this.ctrls.lFoot.y = lerp(this.ctrls.lFoot.y, groundFloorY - 20 * sc, 0.08);
      this.ctrls.rFoot.x = lerp(this.ctrls.rFoot.x, targetX - 18 * sc + swayX * 0.5, 0.08);
      this.ctrls.rFoot.y = lerp(this.ctrls.rFoot.y, groundFloorY - 20 * sc, 0.08);
    }
  }

  updatePhysics() {
    let sc = 0.8;
    for (let node of this.nodesList) if (node) node.update();

    for (let i = 0; i < 16; i++) {
      for (let bone of this.bones) {
        if (!bone) continue;
        if (currentStage === 1 && hugProgress > 0.35 && (bone.n1 === this.nodes.rHand || bone.n2 === this.nodes.rHand || bone.n1 === this.nodes.rElbow || bone.n2 === this.nodes.rElbow)) {
          continue;
        }
        if (currentStage === 2 && stage2Progress > 0.5 && (bone.n1 === this.nodes.rHand || bone.n2 === this.nodes.rHand)) {
          continue;
        }
        bone.solve();
      }

      for (let str of this.strings) {
        if (!str) continue;
        if (currentStage === 2) continue;
        if (currentStage === 1 && hugProgress > 0.35 && str.node === this.nodes.rHand) continue;
        str.solve();
      }

      if (currentStage === 1 || (currentStage === 2 && stage2Progress < 0.60) || currentStage === 3) {
        if (this.nodes.upperBody.y > this.nodes.lowerBody.y - 25 * sc) {
          let correction = (this.nodes.lowerBody.y - 25 * sc) - this.nodes.upperBody.y;
          this.nodes.upperBody.y += correction * 0.5; this.nodes.lowerBody.y -= correction * 0.5;
        }

        let curSpine = atan2(this.nodes.upperBody.y - this.nodes.lowerBody.y, this.nodes.upperBody.x - this.nodes.lowerBody.x);
        let leanOffset = curSpine - (-HALF_PI);
        while (leanOffset > PI) leanOffset -= TWO_PI; while (leanOffset < -PI) leanOffset += TWO_PI;
        if (abs(leanOffset) > 0.55) this.nodes.upperBody.x -= ((abs(leanOffset) - 0.55) * Math.sign(leanOffset)) * this.spineLength * 0.12;

        this.nodes.shoulder.x = this.nodes.upperBody.x + this.shoulderOffsetX;
        this.nodes.shoulder.y = this.nodes.upperBody.y + this.shoulderOffsetY;

        let maxFlare = 70 * sc;
        this.nodes.lFoot.x = constrain(this.nodes.lFoot.x, this.nodes.lowerBody.x - maxFlare, this.nodes.lowerBody.x + maxFlare);
        this.nodes.rFoot.x = constrain(this.nodes.rFoot.x, this.nodes.lowerBody.x - maxFlare, this.nodes.lowerBody.x + maxFlare);
        if (this.nodes.lFoot.y < this.nodes.lowerBody.y + 15 * sc) this.nodes.lFoot.y = this.nodes.lowerBody.y + 15 * sc;
        if (this.nodes.rFoot.y < this.nodes.lowerBody.y + 15 * sc) this.nodes.rFoot.y = this.nodes.lowerBody.y + 15 * sc;

        let spineAngle = atan2(this.nodes.upperBody.y - this.nodes.lowerBody.y, this.nodes.upperBody.x - this.nodes.lowerBody.x);
        let currentHeadAngle = atan2(this.nodes.head.y - this.nodes.upperBody.y, this.nodes.head.x - this.nodes.upperBody.x);
        let diff = currentHeadAngle - spineAngle - this.neutralHeadAngleDiff;
        while (diff > PI) diff -= TWO_PI; while (diff < -PI) diff += TWO_PI;
        if (abs(diff) > 0.08) {
          diff = constrain(diff, -0.08, 0.08);
          let clampedAngle = spineAngle + this.neutralHeadAngleDiff + diff;
          this.nodes.head.x = this.nodes.upperBody.x + cos(clampedAngle) * this.neckLength;
          this.nodes.head.y = this.nodes.upperBody.y + sin(clampedAngle) * this.neckLength;
        }
      }

      for (let n of this.nodesList) {
        if (n) { n.x = constrain(n.x, 20, width - 20); n.y = constrain(n.y, height * 0.05, height - 15); }
      }
    }
  }

  drawSegmentImage(startNode, endNode, img, scaleVal, overlap = 8, angleOffset = 0, offX = 0, offY = 0) {
    if (!img) return;
    let w = img.width * scaleVal; let h = img.height * scaleVal;
    let angle = atan2(endNode.y - startNode.y, endNode.x - startNode.x);
    push();
    translate(startNode.x, startNode.y);
    rotate(angle - HALF_PI + angleOffset);
    if (currentStage === 2 || currentStage === 3) scale(-1, 1);
    imageMode(CENTER);
    image(img, offX, h / 2 - overlap + offY, w, h);
    pop();
  }

  displayStrings() {
    for (let str of this.strings) if (str) str.display();
  }

  displayBackArm() {
    let s = this.scaleVal; let sc = 0.8;
    if (!this.severed.backUpperArm) {
      this.drawSegmentImage(this.nodes.shoulder, this.nodes.lElbow, imgFemaleUpperArm, s, 8 * sc, radians(this.armRot.backUpper), this.assetOffset.backUpper.x, this.assetOffset.backUpper.y);
    }
    if (!this.severed.backLowerArm) {
      this.drawSegmentImage(this.nodes.lElbow, this.nodes.lHand, imgFemaleLowerArmInner, s, 8 * sc, radians(this.armRot.backLower), this.assetOffset.backLower.x, this.assetOffset.backLower.y);
    }
  }

  displayBody() {
    let s = this.scaleVal; let sc = 0.8;
    imageMode(CENTER);

    if (imgFemaleLeg) {
      if (!this.severed.lLeg) this.drawSegmentImage(this.nodes.lowerBody, this.nodes.lFoot, imgFemaleLeg, s, 10 * sc, radians(this.armRot.lLeg), this.assetOffset.lLeg.x, this.assetOffset.lLeg.y);
      if (!this.severed.rLeg) this.drawSegmentImage(this.nodes.lowerBody, this.nodes.rFoot, imgFemaleLeg, s, 10 * sc, radians(this.armRot.rLeg), this.assetOffset.rLeg.x, this.assetOffset.rLeg.y);
    }

    if (imgFemaleLowerBody && !this.severed.lowerBody) {
      push(); translate(this.nodes.lowerBody.x, this.nodes.lowerBody.y);
      let spineAngle = atan2(this.nodes.lowerBody.y - this.nodes.upperBody.y, this.nodes.lowerBody.x - this.nodes.upperBody.x);
      let legAngle = atan2((this.nodes.lFoot.y + this.nodes.rFoot.y)*0.5 - this.nodes.lowerBody.y, (this.nodes.lFoot.x + this.nodes.rFoot.x)*0.5 - this.nodes.lowerBody.x);
      let deltaAngle = legAngle - spineAngle;
      while (deltaAngle > PI) deltaAngle -= TWO_PI; while (deltaAngle < -PI) deltaAngle += TWO_PI;
      rotate((spineAngle + deltaAngle * 0.8) - HALF_PI);
      if (currentStage === 2 || currentStage === 3) scale(-1, 1);
      image(imgFemaleLowerBody, -this.lowerNodeShift.x + this.assetOffset.lowerBody.x, imgFemaleLowerBody.height * s / 2 - this.lowerNodeShift.y + this.assetOffset.lowerBody.y, imgFemaleLowerBody.width * s, imgFemaleLowerBody.height * s);
      pop();
    }
    if (imgFemaleUpperBody && !this.severed.upperBody) {
      push(); translate(this.nodes.upperBody.x, this.nodes.upperBody.y);
      rotate(atan2(this.nodes.upperBody.y - this.nodes.lowerBody.y, this.nodes.upperBody.x - this.nodes.lowerBody.x) + HALF_PI);
      if (currentStage === 2 || currentStage === 3) scale(-1, 1);
      image(imgFemaleUpperBody, -this.upperNodeShift.x + this.assetOffset.upperBody.x, imgFemaleUpperBody.height * s / 2 - this.upperNodeShift.y + this.assetOffset.upperBody.y, imgFemaleUpperBody.width * s, imgFemaleUpperBody.height * s);
      pop();
    }
    if (imgFemaleHead && !this.severed.head) {
      push(); translate(this.nodes.head.x - this.headNodeShift.x, this.nodes.head.y - this.headNodeShift.y);
      rotate(atan2(this.nodes.head.y - this.headNodeShift.y - this.nodes.upperBody.y, this.nodes.head.x - this.headNodeShift.x - this.nodes.upperBody.x) + HALF_PI);
      if (currentStage === 2 || currentStage === 3) scale(-1, 1);
      image(imgFemaleHead, this.assetOffset.head.x, this.assetOffset.head.y, imgFemaleHead.width * s, imgFemaleHead.height * s);
      pop();
    }
  }

  displayFrontArm() {
    let s = this.scaleVal; let sc = 0.8;
    if (!this.severed.frontUpperArm) {
      this.drawSegmentImage(this.nodes.shoulder, this.nodes.rElbow, imgFemaleUpperArm, s, 8 * sc, radians(this.armRot.frontUpper), this.assetOffset.frontUpper.x, this.assetOffset.frontUpper.y);
    }
    if (!this.severed.frontLowerArm) {
      this.drawSegmentImage(this.nodes.rElbow, this.nodes.rHand, imgFemaleLowerArmOuter, s, 8 * sc, radians(this.armRot.frontLower), this.assetOffset.frontLower.x, this.assetOffset.frontLower.y);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}