<template>
  <div class="app">
    <h1>ADHDタスクゲーム（仮）</h1>

    <!-- 追加フォーム -->
    <div class="task-form">
      <input
        v-model="newTaskTitle"
        placeholder="タスクを入力して Enter または 追加ボタン"
        @keyup.enter="addTask"
      />
      <button @click="addTask">追加</button>
    </div>

    <!-- タスク一覧 -->
    <ul class="task-list">


<li
  v-for="task in tasks"
  :key="task.id"
  class="task-item"
  :class="{ 'just-completed': task.justCompleted }"
>
  <span :class="{ done: task.done }">
    {{ task.title }}
  </span>
  <button @click="toggleDone(task)">
    {{ task.done ? '戻す' : '完了！' }}
  </button>
</li>


    </ul>
  </div>
</template>




<script setup>
import { ref, watch } from 'vue'


const clearSound = new Audio('/ファンファーレ6（戦闘勝利）.mp3')
const uttr = new SpeechSynthesisUtterance("よくできました！")
speechSynthesis.speak(uttr)




function playClearSound() {
  clearSound.currentTime = 0  // 毎回頭から再生
  clearSound.play()
}

function speakPraise(message) {
  const uttr = new SpeechSynthesisUtterance(message)
  uttr.lang = 'ja-JP'
  uttr.pitch = 1.1  // 声の高さ
  uttr.rate = 1.0   // 話す速さ
  speechSynthesis.speak(uttr)
}





const STORAGE_KEY = 'adhd_tasks'

// デフォルトのタスク（保存データがまだないとき用）
const defaultTasks = [
  { id: 1, title: 'テストタスク1', done: false, justCompleted: false },
  { id: 2, title: 'テストタスク2', done: true, justCompleted: false },
]

// localStorage からタスクを読み込む
function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return defaultTasks

  try {
    const parsed = JSON.parse(raw)
    // 配列じゃない/おかしいデータならデフォルトに戻す
    if (!Array.isArray(parsed)) return defaultTasks
    return parsed
  } catch (e) {
    console.error('タスクの読み込みに失敗しました', e)
    return defaultTasks
  }
}

// Vue のリアクティブな状態として tasks を持つ
const tasks = ref(loadTasks())

// 新規タスク入力用
const newTaskTitle = ref('')

// タスク追加
function addTask() {
  const title = newTaskTitle.value.trim()
  if (!title) return

tasks.value.push({
  id: Date.now(),
  title,
  done: false,
  justCompleted: false,
})

  newTaskTitle.value = ''
}



function toggleDone(task) {
  const before = task.done
  task.done = !task.done

  if (!before && task.done) {
    // アニメーションはすぐ開始
    task.justCompleted = true
    setTimeout(() => {
      task.justCompleted = false
    }, 400)

    // 効果音を鳴らして…
    clearSound.currentTime = 0
    clearSound.play()

    // 効果音が鳴り終わったら褒める
    clearSound.onended = () => {
      speakPraise(randomPraise())
      clearSound.onended = null  // 一応リセットしておくと安心
    }
  }
}



// 👇 tasks が変わるたびに localStorage に保存
watch(
  tasks,
  (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  },
  { deep: true } // ネストした中身の変更も検知する
)
</script>





<style scoped>
h1 {
  text-align: center;
}

.task-item.just-completed {
  animation: task-glow 0.4s ease-out;
}

@keyframes task-glow {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(255, 215, 0, 0.8);
    background-color: rgba(255, 250, 205, 0.5); /* ほんのり */
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 16px rgba(255, 215, 0, 0.9);
    background-color: rgba(255, 250, 205, 0.9);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(255, 215, 0, 0);
    background-color: transparent;
  }
}

</style>






const clearSound = new Audio('/ファンファーレ6（戦闘勝利）.mp3')

function playClearSound() {
  clearSound.currentTime = 0  // 毎回頭から再生
  clearSound.play()
}



