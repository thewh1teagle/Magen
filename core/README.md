# oref-rs

Pikud Haoref with Rust



### Test Original API's

Oref API:
```shell
while true; do 
curl "https://www.oref.org.il/WarningMessages/Alert/alerts.json" -H "Referer: https://www.oref.org.il/" -H "X-Requested-With: XMLHttpRequest"
sleep 1
done
```


Oref With Proxy:
```
curl "https://www.oref.org.il/WarningMessages/Alert/alerts.json" -H "Referer: https://www.oref.org.il/" -H "X-Requested-With: XMLHttpRequest" --proxy-insecure --proxy http://194.62.42.29:3128
```


Pattern used in docker:
[https://blog.jarrousse.org/2022/04/09](https://blog.jarrousse.org/2022/04/09/an-elegant-way-to-use-docker-compose-to-obtain-and-renew-a-lets-encrypt-ssl-certificate-with-certbot-and-configure-the-nginx-service-to-use-it/)