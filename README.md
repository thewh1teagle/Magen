# Magen
<img src="https://github.com/thewh1teagle/Magen/assets/61390950/246ae45a-8a00-45b8-8239-cde4e61dcb7f" width="145px" height="160px" />

Apps and bots for Israel pikud haoref


# Available channels
Telegram channel which sends live alerts including a map image


- [Magen Telegram](https://t.me/MagenAlerts)

Interactive web based map for pikud haoref

- [Magen Web](https://thewh1teagle.github.io/Magen/)


# Contents of Repository

Core library written in Rust for interacting with pikud haoref
- [oref](https://github.com/thewh1teagle/Magen/tree/main/magen_srv/oref)
  
Rust based `ws` server which emits new alerts from pikud haoref

- [magen_srv](https://github.com/thewh1teagle/Magen/tree/main/magen_srv/magen_srv)

`NodeJS` API along with `Flutter` App which uses `Firebase` for getting new alerts

- [mobile](https://github.com/thewh1teagle/Magen/tree/main/apps/mobile)

`React` based web application with interactive map, shows live alerts on the map

- [web](https://github.com/thewh1teagle/Magen/tree/main/apps/web)

`NodeJS` based telegram bot which sends live alerts to public channel along with dynamic map image

- [telegram_bot](https://github.com/thewh1teagle/Magen/tree/main/apps/telegram_bot)
