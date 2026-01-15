console.log("Market JS Loaded");

const CONTRACT_ADDRESS = "0x8164214b395b68Bc2BAe5F38728E7c790066E7b8";

const grid = document.getElementById("marketGrid");

fetch("data/nfts.json")
  .then(res => res.json())
  .then(nfts => {
    nfts.forEach(nft => {

      const card = document.createElement("div");
      card.className = "nft-card";

      card.innerHTML = `
        <div class="media-box">
          <img src="${nft.image}">
          <video src="${nft.video}" muted loop playsinline></video>
        </div>
        <div class="nft-info">
          <h3>${nft.name}</h3>
          <span>Price: ${nft.price} POL</span>
          <button class="mint-btn" data-id="${nft.id}">Mint</button>
        </div>
      `;

      const video = card.querySelector("video");

      card.addEventListener("mouseenter", () => video.play());
      card.addEventListener("mouseleave", () => video.pause());

      grid.appendChild(card);
    });
  })
  .catch(err => console.error(err));

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("bg"),
  alpha: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// 🌌 Night gradient background
scene.background = new THREE.Color(0x050509);

// ✨ Stars
const starGeometry = new THREE.BufferGeometry();
const starCount = 3500;
const starVertices = [];

for(let i=0;i<starCount;i++){
  starVertices.push(
    (Math.random()-0.5)*800,
    (Math.random()-0.5)*800,
    (Math.random()-0.5)*800
  );
}

starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starVertices,3)
);

const starMaterial = new THREE.PointsMaterial({
  color: 0xfff7d6,
  size: 0.6,
  transparent: true
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// ☄️ Meteors (orange glow)
const meteorGeometry = new THREE.CylinderGeometry(0.05,0.2,6,6);
const meteorMaterial = new THREE.MeshBasicMaterial({
  color: 0xff8c00
});

const meteors = [];

for(let i=0;i<250;i++){
  const m = new THREE.Mesh(meteorGeometry, meteorMaterial);
  resetMeteor(m,true);
  scene.add(m);
  meteors.push(m);
}

function resetMeteor(m,first=false){
  m.position.set(
    (Math.random()-0.5)*800,
    first ? Math.random()*800 : 600,
    (Math.random()-0.5)*800
  );
}

// 🎥 Animation
function animate(){
  requestAnimationFrame(animate);

  stars.rotation.y += 0.0005;

  meteors.forEach(m=>{
    m.position.y -= 2.5;
    m.position.x += 0.6;
    if(m.position.y < -600) resetMeteor(m);
  });

  renderer.render(scene,camera);
}

animate();

// 📱 Responsive fix
window.addEventListener("resize", ()=>{
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

document.querySelector(".hero-order-btn").addEventListener("click",()=>{
  toggleForm();   // نفس الفنكشن القديمة
});
const promoCodes = ["12389", "190876", "560943", "539088", "439081"];

const emailInput = document.getElementById("email");
const promoInput = document.getElementById("promo");
const confirmBtn = document.getElementById("confirmBtn");

const emailIcon = document.getElementById("emailIcon");
const promoIcon = document.getElementById("promoIcon");

emailInput.addEventListener("input", validateForm);
promoInput.addEventListener("input", validateForm);

function validateForm() {
  const email = emailInput.value.trim();
  const promo = promoInput.value.trim();

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const promoValid = promoCodes.includes(promo);

  updateIcon(emailIcon, emailValid, email);
  updateIcon(promoIcon, promoValid, promo);

  confirmBtn.disabled = !(emailValid && promoValid);
}

function updateIcon(icon, valid, value) {
  if (!value) {
    icon.style.display = "none";
    return;
  }
  icon.src = valid
    ? "data/nfts/checked_green.png"
    : "data/nfts/checked_red.png";
  icon.style.display = "block";
}

confirmBtn.addEventListener("click", () => {
  const email = emailInput.value.trim();
  const promo = promoInput.value.trim();

  if (confirmBtn.disabled) return;

  confirmBtn.innerText = "Sending...";
  confirmBtn.disabled = true;

  emailjs.send(
    "service_s9lz8d8",
    "template_qu962bg",
    {
      user_email: email,
      promo_code: promo,
      time: new Date().toLocaleString()
    },
    "OP5t40PkqQoQolPgJ"
  )
  .then(() => {

  confirmBtn.classList.add("success");
  confirmBtn.innerText = "Order Completed ✓";

  let msg = document.createElement("div");
  msg.className = "success-message";
  msg.innerText = "Your order has been received. We will contact you within 24 hours.";

  confirmBtn.after(msg);

  setTimeout(() => {
    document.getElementById("orderOverlay").style.display = "none";
    document.getElementById("orderBox").style.display = "none";

    confirmBtn.classList.remove("success");
    confirmBtn.innerText = "Confirm";
    confirmBtn.disabled = false;
    emailInput.value = "";
    promoInput.value = "";
    msg.remove();
  }, 5000);
})

  .catch(() => {
    confirmBtn.innerText = "Error";
    confirmBtn.disabled = false;
  });
});

function openOrder() {
  document.getElementById("orderOverlay").style.display = "block";
  document.getElementById("orderBox").style.display = "block";
}

document.getElementById("orderOverlay").onclick = () => {
  document.getElementById("orderOverlay").style.display = "none";
  document.getElementById("orderBox").style.display = "none";
};
