import './style.css'
import * as THREE from "three";
import { TetrahedronGeometry, TubeGeometry, WebGLRenderer } from 'three';
import bg from "./bg/bg.jpg";

//キャンバス
const canvas = document.querySelector('.webgl');
//サイズ
const sizes = {
  width: innerWidth,
  height: innerHeight,
}

/**
 * シーン
 */
const scene = new THREE.Scene();

//背景を設定
const textureLoder = new THREE.TextureLoader();
const bgtexture = textureLoder.load(bg);
scene.background = bgtexture;

/**
 * カメラ
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
)

/**
 * レンダラー
 */
const renderer = new THREE.WebGLRenderer({
  canvas:canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);


/*
オブジェクトの作成
*/

//ボックス
const boxGeometry = new THREE.BoxGeometry(5, 5, 5, 10);
const boxMaterial = new THREE.MeshNormalMaterial();
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 0.5, -15);
box.rotation.set(1, 1, 0);

//トーラス
const torusGeometry = new THREE.TorusGeometry(8,2,16,100);
const torusMaterial = new THREE.MeshNormalMaterial();
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(0, 1, 10);
scene.add(box, torus);

/*
スクロールアニメーション
*/

//線形補間の公式
function lerp(x, y, a){
  return (1 - a) * x + a * y;
}
//滑らかに動かす(a)
function scaleParcent(start, end){
  return (scrollParcent - start) / (end - start);
};
//配列を用意
const animationScripts = [];

//配列に入れていく
//スクロールに応じて移動
animationScripts.push({
  start: 0,
  end: 40,
  function (){
    camera.lookAt(box.position);
    camera.position.set(0,1,10);
    box.position.z = lerp(-15, 2, scaleParcent(0, 40));
    torus.position.z = lerp(10, -20, scaleParcent(0, 40));
  }
});

//スクロールに応じて回転
animationScripts.push({
  start: 40,
  end: 60,
  function (){
    camera.lookAt(box.position);
    camera.position.set(0,1,10);
    box.rotation.z = lerp(0, Math.PI, scaleParcent(40, 60));
  }
});
//スクロールに応じてカメラを移動
animationScripts.push({
  start: 60,
  end: 80,
  function (){
    camera.lookAt(box.position);
    camera.position.x = lerp(0, -15, scaleParcent(60, 80));
    camera.position.y = lerp(1, 15, scaleParcent(60, 80));
    camera.position.z = lerp(10, 25, scaleParcent(60, 80));

  }
});
//常に回転
animationScripts.push({
  start: 80,
  end: 100,
  function (){
    box.rotation.x += 0.02;
    box.rotation.y += 0.02;

  }
});



//ブラウザのスクロール率を取得
let scrollParcent = 0;
document.body.onscroll = () =>{
  scrollParcent =
  (document.documentElement.scrollTop /
  (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100; /* 画面の一番上　/ 全体 - 画面の高さ * 100 */
  console.log(scrollParcent);
  // console.log(document.documentElement.scrollTop);
  // console.log(document.documentElement.scrollHeight);
  // console.log(document.documentElement.clientHeight);
}

//アニメーションを開始
function playScroolAnimation() {
  animationScripts.forEach((animation) => {
    //スクロールの量に応じて
    if(scrollParcent >= animation.start && scrollParcent <= animation.end){
      animation.function();
    }
  });
};


//アニメーション
const tick = () =>{
  window.requestAnimationFrame(tick);

  //アニメーションを入れる
  playScroolAnimation();

  renderer.render(scene, camera);
}
tick();


//リサイズ処理
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //レンダラー
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);

  //カメラ
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
})
