<template>
  <div class="home-container">
    <!-- 如何获取凭据的教程 -->
    <div class="tutorial-container">
      <div class="title">如何获取凭据</div>
      <div class="method">
        <span class="tag success">方法一</span>
        <div>1. 打开<a @click="openLink('https://www.skland.com/')">森空岛网页版</a>并登录。</div>
        <div>2. 打开网页开发工具（按F12）并切换到<span class="tag">应用程序</span>选项卡。</div>
        <div>3. 选择<span class="tag">存储 -> 本地存储 -> https://www.skland.com</span></div>
        <div>4. 右侧面板中<span class="tag">SK_OAUTH_CRED_KEY</span>的值就是您的凭据。</div>
        <div><button @click="showModal1 = true">查看截图</button></div>
        <div v-if="showModal1" @click="closeModal1" class="modal">
          <!-- 模态内容 -->
          <img class="modal-content" src="/GetCred1.png" alt="Description">
        </div>
      </div>
      <div class="method">
        <span class="tag success">方法二</span>
        <div>1. 打开<a @click="openLink('https://www.skland.com/')">森空岛网页版</a>并登录。</div>
        <div>2. 打开网页开发工具（按F12）并切换到<span class="tag">控制台</span>选项卡。</div>
        <div>3. 在控制台中输入以下内容并回车：<br><span class="command">{{ command1 }}</span></div>
        <div>4. 控制台返回的值就是您的凭据（不包含单引号）。</div>
        <div><button @click="showModal2 = true">查看截图</button></div>
        <div v-if="showModal2" @click="closeModal2" class="modal">
          <!-- 模态内容 -->
          <img class="modal-content" src="/GetCred2.png" alt="Description">
        </div>
      </div>
      <div class="method">
        <span class="tag success">方法三</span>
        <div>1. 打开<a @click="openLink('https://www.skland.com/')">森空岛网页版</a>并登录。</div>
        <div>2. 在浏览器地址栏中输入以下内容并回车：<br><span class="command">{{ command2 }}</span></div>
        <div>3. 浏览器弹出的对话框内的值就是您的凭据。</div>
        <div>安卓手机切换为桌面模式后，可以使用本方法获取Cred。</div>
      </div>
      <div class="warning"><span>请妥善保管您的凭据，切勿透露给他人！</span></div>
      <div class="warning">
        <span>信息收集声明：<br>使用该功能将默认允许我们匿名上传您的干员练度数据（不包含任何可以识别您的个人信息）到我们的服务器来统计干员培养数据从而改进计分规则。按下开始打分按钮即表示您同意我们收集上述数据。</span>
      </div>
      <div class="warning"><span>我们不会上传您的凭据，以及任何可以识别您的信息的数据到服务器，该凭据仅用于在您的浏览器中本地请求一次您的练度数据。</span></div>
      <div class="input-section">
        将您复制的凭据粘贴到这个文本框中，然后点击开始打分按钮<br>
        <input type="text" v-model="jsonInput" placeholder="粘贴复制到的凭据">
        <button @click="handleButtonClick">开始打分</button>
      </div>
    </div>
    <div class="character-static">
      <CharacterStatic />
    </div>
  </div>
</template>
  
<script lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CharacterStatic from '../views/CharacterStatic.vue'

export default {
  name: 'AquireToken',
  setup() {
    const command1 = ref('localStorage.getItem("SK_OAUTH_CRED_KEY");');
    const command2 = ref('javascript:prompt(undefined, localStorage.getItem("SK_OAUTH_CRED_KEY"))');
    const openLink = (url: string) => {
      window.open(url, '_blank');
    };
    const jsonInput = ref('');
    const router = useRouter();
    const showModal1 = ref(false);
    function closeModal1(event: Event) {
      // 确保只在点击模态窗口背景时关闭模态窗口
      if ((event.target as Element).classList.contains('modal')) {
        showModal1.value = false;
      }
    }
    
    const showModal2 = ref(false);
    function closeModal2(event: Event) {
      // 确保只在点击模态窗口背景时关闭模态窗口
      if ((event.target as Element).classList.contains('modal')) {
        showModal2.value = false;
      }
    }

    onMounted(() => {
      const tokenFromSession = sessionStorage.getItem('tokenValue');
      if (tokenFromSession) {
        router.push({ name: 'PlayerRating' });
      }
    });
    const handleButtonClick = () => {
      try {
        const tokenValue = jsonInput.value;
        sessionStorage.setItem('tokenValue', tokenValue);
        router.push({ name: 'PlayerRating' });
      }
      catch (error) {
        alert("请确保您粘贴的是一个有效的凭据内容。");
      }
    };
    return {
      command1,
      command2,
      openLink,
      jsonInput,
      handleButtonClick,
      closeModal1,
      showModal1,
      closeModal2,
      showModal2,
    };
  },
  components: { CharacterStatic }
}
</script>
  
<style scoped>
/* 隐藏模态窗口 */
.modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1;
}

/* 模态内容 */
.modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 90%;
  max-height: 90%;
}

.home-container {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  background-color: aliceblue;
  justify-content: space-between;
}

.tutorial-container {
  display: flex;
  width: 500px;
  flex-direction: column;
  gap: 16px;
}

.character-static {
  flex-grow: 1;
}

.title {
  margin-top: 10px;
  font-weight: bold;
  text-align: center;
}

.method {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f5f5f5;
}

.tag {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
}

.tag.success {
  background-color: #28a745;
  color: white;
}

.warning {
  margin-left: 5px;
  margin-right: 5px;
  border-radius: 4px;
  font-weight: bold;
  text-align: center;
  background-color: #ffc107;
}

.command {
  font-family: 'Courier New', Courier, monospace;
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f5f5f5;
  margin-top: 16px;
}

input[type="text"] {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}

button {
  align-self: start;
  padding: 6px 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #2980b9;
}
</style>
  