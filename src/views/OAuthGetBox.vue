<template>
    <div class="home-container">
        <!-- 如何获取凭据的教程 -->
        <div class="tutorial-container">
            <div class="title">如何获取凭据</div>
            <div class="method">
                <span class="tag success">OAuth</span>
                <div>按下下面的按钮，并根据提示操作。</div>
                <div><button @click="handleButtonClick">授权获取Box</button></div>
            </div>
            <div class="warning">
                <span>信息收集声明：<br>使用该功能将默认允许我们匿名上传您的干员练度数据（不包含任何可以识别您的个人信息）到我们的服务器来统计干员培养数据从而改进计分规则。按下开始打分按钮即表示您同意我们收集上述数据。</span>
            </div>
            <div class="warning"><span>使用OAuth方式获取您的Box时，我们无法获取到您的个人信息，您可以放心使用。</span></div>
        </div>
    </div>
</template>
    
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import qs from 'qs';

const router = useRouter()

//使用开发者账户注册并登录森空岛凭据管理中心，然后在应用管理里添加你的应用，记录下应用Id和Secret。
//应用Id可以随意公开，你可以将其直接写入前端，就像下面这个变量一样。
var oAuthClientId = "3c7ba8ceefb140f0a14c9124ffa409b1"
//Secret则必须要保密，请务必将其放在后端，并且不要写在代码中或提交到版本管理软件中。

const handleButtonClick = () => {
    try {
        var state = 'testState'
        //在有后端的情况下,这个地址应当是一个空白网页,将数据中的code和state传回给后端，然后自己自动关闭
        //当然如果你喜欢，做一个“授权成功”的页面给客户看也是可以的。
        //在本例中，我们重定向回到本页面。在下面的代码里模拟后端的流程。
        var redirectUri = 'https://amiya-bot-score.hsyhhssyy.net/OAuthGetBox'
        var encodedRedirectUri = encodeURIComponent(redirectUri);

        //你可以选择打开一个新标签页或者新窗口访问下面的页面，而当前窗口则通过ajax等待后端通知他验证完成。
        //（页面上显示“请在新窗口中完成验证”或者“等待验证结果”之类的内容。）
        //你也可以选择像本页面这样，重定向到本页面并接受code然后传给后端。
        //本例出于演示目的，在本页面直接重定向。
        //state是用于向回调接口传递参数用的，你如果使用ajax在前端等待，则需要生成一个随机字符串或者传递一个内部id之类的东西。
        //后端在回调时，会将state原封不动的传回回调地址，你的后端回调应该根据state的值，通知对应的前端页面验证已经完成。
        window.location.href = `https://amiya-bot-service.hsyhhssyy.net/OAuth?client-id=${oAuthClientId}&state=${state}&redirectUri=${encodedRedirectUri}`;

    } catch (error) {

    }
};

//警告，下面这部分代码，应当是一个服务器代码
//OAuth规范中，不推荐没有后端的应用使用OAuth获取用户数据，因为这样你就必须要公开你的Secret，这样任何人都可以伪造你的请求。
onMounted(async () => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
        //正确的做法，应当是将code传回后端，后端换取token，并将其和一个你自己网站的凭证（比如临时session，uid等）关联。
        //后续通过你自己的网络凭证，向你自己的后端发送请求，后端用保存的token访问获取玩家box等数据。        

        //Secret本应保密，这里将其写出是为了演示需要，实际上该凭据甚至不应该出现在代码中，而是应该用诸如环境变量，软件配置等加密设施存储。
        var oAuthClientSecret = "5dZBQj6op1wVOB0IUKU+GCjxs5OoBqeYLxE3GdhSoEE="

        //接下来，需要使用你的ClientId，ClientSecret，code来换取token，再强调一遍，ClientSecret不应该被放在前端，这里仅仅是一个展示。
        //此处仍需提供redirect_uri,并且要和当时申请code时发送的一致，验证服务器会校验。
        const data = {
            grant_type: 'authorization_code',
            client_id: oAuthClientId,
            client_secret: oAuthClientSecret,
            code: code,
            redirect_uri: 'https://amiya-bot-score.hsyhhssyy.net/OAuthGetBox'
        };

        const response = await axios({
            method: 'POST',
            url: 'https://amiya-bot-service.hsyhhssyy.net/connect/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify(data)
        });
        const accessToken = response.data.access_token;
        console.log(accessToken)

        //到这里，你就获取到了AccessToken，这个AccessToken也不能传递给前端，因为他比ClientSecret更危险。
        //恶意程序可以通过这个token以你的身份调用api获取授权用户的数据。
        //如果我们检测到这个secret被泄漏,可能会禁用对应的client确保用户数据安全。

        //下面这段代码，会通过这个accessToken,获取用户的box，然后将其传递给打分页面。
        const playerBoxResponse = await axios.post('https://amiya-bot-service.hsyhhssyy.net/api/SKLandBox/GetBox',
            {
                'PartList': 'chars,charInfoMap,status'
            }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (playerBoxResponse.data["code"] == 0) {
            sessionStorage.removeItem('tokenValue');
            sessionStorage.setItem('jsonValue', JSON.stringify(playerBoxResponse.data.data));
            router.push({ name: 'PlayerRating' });
        } else {
            router.push("/");
        }
    }
});

//服务器代码结束，再次重复一遍，上面这个代码应当是服务器代码。

</script>
    
<style scoped>
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
    