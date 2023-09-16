FROM nginx:latest

RUN rm -rf /usr/share/nginx/html
COPY ./dist /usr/share/nginx/html

# 配置完全路由，供vue使用
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
STOPSIGNAL SIGQUIT
CMD ["nginx", "-g", "daemon off;"]