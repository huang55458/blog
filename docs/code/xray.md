---
title: xray
author: chumeng
date: '2022-9-7'
---



## acme

```shell
curl https://get.acme.sh | sh -s email=my@example.com
~/.acme.sh/acme.sh --issue -d 域名 --standalone
~/.acme.sh/acme.sh --installcert -d 域名 --fullchainpath /etc/ssl/private/chumeng.crt --keypath /etc/ssl/private/chumeng.key
chmod 755 /etc/ssl/private/*
~/.acme.sh/acme.sh --upgrade --auto-upgrade
```

## nginx

```shell
apt update && apt install nginx -y
mkdir -p /var/www/website/html
vi /etc/nginx/nginx.conf
systemctl enable nginx
```

```conf
server {
     listen 80;
     server_name 你的域名;
     return 301 https://$http_host$request_uri;
}
server {
     listen 127.0.0.1:8080;
     root /var/www/website/html;
     index index.html;
}
```

## xray

```shell
bash -c "$(curl -L https://github.com/XTLS/Xray-install/raw/main/install-release.sh)" @ install
cat /proc/sys/kernel/random/uuid
vi /usr/local/etc/xray/config.json
systemctl start xray
systemctl enable xray
```

```json
// REFERENCE:
// https://github.com/XTLS/Xray-examples
// https://xtls.github.io/config/
// 常用的 config 文件，不论服务器端还是客户端，都有 5 个部分。外加小小白解读：
// ┌─ 1*log 日志设置 - 日志写什么，写哪里（出错时有据可查）
// ├─ 2_dns DNS-设置 - DNS 怎么查（防 DNS 污染、防偷窥、避免国内外站匹配到国外服务器等）
// ├─ 3_routing 分流设置 - 流量怎么分类处理（是否过滤广告、是否国内外分流）
// ├─ 4_inbounds 入站设置 - 什么流量可以流入 Xray
// └─ 5_outbounds 出站设置 - 流出 Xray 的流量往哪里去
{
  // 1\_日志设置
  "log": {
    "loglevel": "warning", // 内容从少到多: "none", "error", "warning", "info", "debug"
    "access": "/var/log/xray/access.log", // 访问记录
    "error": "/var/log/xray/error.log" // 错误记录
  },
  // 2_DNS 设置
  "dns": {
    "servers": [
      "https+local://1.1.1.1/dns-query", // 首选 1.1.1.1 的 DoH 查询，牺牲速度但可防止 ISP 偷窥
      "localhost"
    ]
  },
  // 3*分流设置
  "routing": {
    "domainStrategy": "AsIs",
    "rules": [
      // 3.1 防止服务器本地流转问题：如内网被攻击或滥用、错误的本地回环等
      {
        "type": "field",
        "ip": [
          "geoip:private" // 分流条件：geoip 文件内，名为"private"的规则（本地）
        ],
        "outboundTag": "block" // 分流策略：交给出站"block"处理（黑洞屏蔽）
      },
      // 3.2 屏蔽广告
      {
        "type": "field",
        "domain": [
          "geosite:category-ads-all" // 分流条件：geosite 文件内，名为"category-ads-all"的规则（各种广告域名）
        ],
        "outboundTag": "block" // 分流策略：交给出站"block"处理（黑洞屏蔽）
      }
    ]
  },
  // 4*入站设置
  // 4.1 这里只写了一个最简单的 vless+xtls 的入站，因为这是 Xray 最强大的模式。如有其他需要，请根据模版自行添加。
  "inbounds": [
    {
      "port": 443,
      "protocol": "vless",
      "settings": {
        "clients": [
          {
            "id": "", // 填写你的 UUID
            "flow": "xtls-rprx-direct",
            "level": 0,
            "email": "vpsadmin@yourdomain.com"
          }
        ],
        "decryption": "none",
        "fallbacks": [
          {
            "dest": 8080 // 默认回落到防探测的代理
          }
        ]
      },
      "streamSettings": {
        "network": "tcp",
        "security": "xtls",
        "xtlsSettings": {
          "allowInsecure": false, // 正常使用应确保关闭
          "minVersion": "1.2", // TLS 最低版本设置
          "alpn": ["http/1.1"],
          "certificates": [
            {
              "certificateFile": "/etc/ssl/private/chumeng.crt",
              "keyFile": "/etc/ssl/private/chumeng.key"
            }
          ]
        }
      }
    }
  ],
  // 5*出站设置
  "outbounds": [
    // 5.1 第一个出站是默认规则，freedom 就是对外直连（vps 已经是外网，所以直连）
    {
      "tag": "direct",
      "protocol": "freedom"
    },
    // 5.2 屏蔽规则，blackhole 协议就是把流量导入到黑洞里（屏蔽）
    {
      "tag": "block",
      "protocol": "blackhole"
    }
  ]
}
```

## 定时任务

```shell
vi /root/xray-cert-renew.sh
chmod +x /root/xray-cert-renew.sh
crontab -e
0 1 1 * *   bash /root/xray-cert-renew.sh
```

```bash
#!/bin/bash

~/.acme.sh/acme.sh --install-cert -d 域名 --ecc --fullchain-file  /etc/ssl/private/chumeng.crt --key-file  /etc/ssl/private/chumeng.key
echo "Xray Certificates Renewed"
       
chmod +r /etc/ssl/private/chumeng.key
echo "Read Permission Granted for Private Key"

sudo systemctl restart xray
echo "Xray Restarted"
```

