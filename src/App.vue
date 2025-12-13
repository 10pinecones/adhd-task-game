<template>
  <div class="app">
    <h1>ADHDタスク_0.1</h1>

    <!-- 初期化 -->
    <button @click="resetTasks">初期状態に戻す</button>
    
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
        <div class="task-main">
          <span class="task-title" :class="{ done: task.done }">{{ task.title }}</span>
        </div>

        <div class="task-actions">
          <button 
            class="btn btn-small" 
            :class="{ 'btn-undo': task.done }"
            @click="toggleDone(task)"
          >
            {{ task.done ? '戻す' : '完了' }}
          </button>
          <button class="btn btn-small btn-danger" @click="deleteTask(task)">
            削除
          </button>
        </div>
      </li>

    </ul>
    <FireworksOverlay :active="showFireworks" />
  </div>
</template>




<script setup>

  //花火関連
  import FireworksOverlay from './components/FireworksOverlay.vue'
  import { ref, watch } from 'vue'
  const showFireworks = ref(false)

  const clearSound = new Audio(import.meta.env.BASE_URL + 'clear.mp3')
  //const uttr = new SpeechSynthesisUtterance("よくできました！")
  //speechSynthesis.speak(uttr)




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
    { id: 1, title: '買物', done: false, justCompleted: false },
    { id: 2, title: '晩御飯準備', done: false, justCompleted: false },
    { id: 3, title: '洗濯準備', done: false, justCompleted: false },
    { id: 4, title: '洗濯機回す', done: false, justCompleted: false },
    { id: 5, title: '洗濯物干す', done: false, justCompleted: false },
    { id: 6, title: '暖房確認', done: false, justCompleted: false },


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



  // タスク初期化
  function resetTasks() {
    // 配列をコピーしてセット（参照渡しになるので注意）
    tasks.value = defaultTasks.map(t => ({ ...t }))

    // localStorage も上書きされる（watch が自動実行）
  }



  // タスク削除
  function deleteTask(task) {
    tasks.value = tasks.value.filter(t => t.id !== task.id)
  }

  function toggleDone(task) {
    const before = task.done
    task.done = !task.done

    if (!before && task.done) {
      task.justCompleted = true
      setTimeout(() => {
        task.justCompleted = false
      }, 400)

      // 効果音
      clearSound.currentTime = 0
      clearSound.play()

      clearSound.onended = () => {
        speakPraise(randomPraise())
        clearSound.onended = null
      }

      // ★ 花火ON → 1.5秒後にOFF
      showFireworks.value = true
      setTimeout(() => {
        showFireworks.value = false
      }, 5000)
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
.app {
  width: 100%;
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem; /* Mobile friendly size */
  color: #213547;
}

/* フォーム周り */
.task-form {
  display: flex;
  gap: 10px;
  margin-bottom: 2rem;
  flex-wrap: wrap; /* スマホで折り返せるように */
}

.task-form input {
  flex: 1;
  padding: 12px;
  font-size: 16px; /* 16px以上でiOSのズーム防止 */
  border: 1px solid #ccc; /* Lighter border */
  border-radius: 8px;
  background-color: #ffffff;
  color: #213547;
  min-width: 200px;
}

.task-form button {
  padding: 12px 24px;
  font-weight: bold;
  background-color: #646cff; /* Primary color */
  color: white;
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* タスクリスト */
.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* タスクアイテム（カードデザイン） */
.task-item {
  background-color: #ffffff;
  border: 1px solid #e0e0e0; /* Subtle border */
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); /* Softer shadow */
  transition: all 0.2s ease;
  gap: 10px;
  color: #213547;
}

.task-main {
  text-align: left;
  flex: 1;
}

.task-title {
  font-size: 1.1rem;
  font-weight: 500;
  word-break: break-all; /* 長い単語での崩れ防止 */
}

.task-title.done {
  text-decoration: line-through;
  color: #aaa;
}

/* ボタン群 */
.task-actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  color: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.task-actions button {
    background-color: #4CAF50; /* 完了ボタン (デフォルト: 緑) */
    color: white;
}

.task-actions button.btn-undo {
    background-color: #e0e0e0; /* 戻すボタン: グレー */
    color: #555; /* 文字色: 深めのグレー */
    border: 1px solid #ccc; /* 境界線追加で視認性確保 */
}

.task-actions .btn-danger {
  background-color: #f44336; /* 削除ボタン */
  color: white;
}

/* 完了時のアニメーション */
.task-item.just-completed {
  animation: task-glow 0.6s ease-out;
}

@keyframes task-glow {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(255, 215, 0, 0.6);
    background-color: #fff9c4; /* Light yellow */
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
    background-color: #fff59d;
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(255, 215, 0, 0);
    background-color: #ffffff;
  }
}

/* スマホ向けの微調整 */
@media (max-width: 480px) {
  .task-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .task-actions {
    width: 100%;
    margin-top: 10px;
    justify-content: flex-end;
  }

  .btn {
    flex: 1; /* ボタンを押しやすく */
    max-width: 100px;
  }
}
</style>





