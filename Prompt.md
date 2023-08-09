def upload_data(data_dict,user_id):
    try:
        # 阿里云oss只写权限账户
        OSS_ACCESS_ID = 'LTAI5tFf4i8dvmmtLJXqA48X'
        OSS_ACCESS_KEY = 'u6yqUCZXtXTliRpf5fdhtCRFb8P3WD'
        OSS_ENDPOINT = 'oss-cn-beijing.aliyuncs.com'
        OSS_BUCKET = 'amiyabot-playerbox-collector'
        OBJECT_DIRECTORY = 'collected_data_v1'

        current_time = datetime.datetime.now().strftime('%Y%m%d.%H%M%S')

        hashed_uid = hash_uid(user_id)

        FILE_NAME = f"chars.{hashed_uid}.{current_time}.json"

        json_data = json.dumps(data_dict).encode('utf-8')

        date = datetime.datetime.utcnow().strftime('%a, %d %b %Y %H:%M:%S GMT')
        string_to_sign = f'PUT\n\napplication/json\n{date}\n/{OSS_BUCKET}/{OBJECT_DIRECTORY}/{FILE_NAME}'
        h = hmac.new(OSS_ACCESS_KEY.encode('utf-8'), string_to_sign.encode('utf-8'), digestmod=hashlib.sha1)
        signature = base64.encodebytes(h.digest()).strip()

        headers = {
            'Date': date,
            'Authorization': f'OSS {OSS_ACCESS_ID}:{signature.decode("utf-8")}',
            'Content-Type': 'application/json'
        }

        # 发送请求
        response = requests.put(f'http://{OSS_BUCKET}.{OSS_ENDPOINT}/{OBJECT_DIRECTORY}/{FILE_NAME}', data=json_data, headers=headers)

        log.info(f'发送用户box返回信息:{response.content}')
    except Exception as e:
        log.info(f"发送用户box时出错:{str(e)}")

能否用axios改写这个python函数的js版