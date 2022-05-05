# MOLLTALK
molltalk은 채팅 웹 어플리케이션 입니다.

* 회원 : 매우 간단한 회원가입과 로그인

* 채팅 : 채팅방 생성을 통한 프라이빗한 환경의 채팅 가능

* 알림 : 채팅방 내 유저 초대 기능과 초대/상태 여부, 입/퇴장 실시간 알림

* 쉘 접속 : 쉘 환경의 웹소켓 접속을 통한 채팅 기능 구현

# SKILLS
BackEnd : `JavaScript`, `Express.js`, `Mongoose`, `MongoDB`, `MySQL`, `WebSocket`, `Jest`

FrontEnd : `JavaScript`, `React`, `Recoil`

# URL
### API
https://api.zodaland.com

### WEB

#### development
https://mt.test.zodaland.com

#### production
https://mt.zodaland.com

# SSH Connection
**웹 애플리케이션을 통해 아이디와 방에 접속중인 상태여야 합니다.**
1. `npm i -g wscat`
2. wscat -c wss://api.zodaland.com
3. 아이디 입력
4. 비밀번호 입력
5. 입장 중인 방 이름 입력

# INSTALLATION
* Node version : `v14.16.1 (LTS)`
* Docker version : `20.10.6, build 370c289`
* docker-compose vervison : `1.29.1, build c34c88b2`

git을 통해 clone 합니다.
```git clone https://github.com/zodaland/molltalk.git```

# GETTING STARTED
* yarn version : 1.22.5

## API
### Start with Node.js
1. nodemon 설치
```yarn global add nodemon@latest```

2. 시작 커맨드
```yarn && yarn start```

### Start with Docker, docker-compose
1. docker-compose.yml을 프로젝트 루트에 생성합니다.

docker-compose.yml example
```
version: '3'

services:
  api:
    container_name: molltalk-api
    build:
      context: .
      dockerfile: ./api/Dockerfile
    volumes:
      - ./api:/home/node
    restart: always
  web:
    container_name: molltalk-web
    build:
      context: .
      dockerfile: ./web/Dockerfile
    volumes:
      - ./web:/home/node
    restart: always
```

2. 시작 커맨드
```docker-compose up -d --build```

# API SPECIFICATION
### http
**/auth**
post  /register : 회원가입
- data
  1. id: 아이디
  2. password: 비밀번호
  3. name: 이름
post  /login : 로그인
- data
  1. id: 아이디
  2. password: 비밀번호
any   /logout

**/room**
post / - create : 방 생성
- data
  1. name: 방 이름
get / - find : 접속중인 방 목록 조회

get /user - find : 방에 접속중인 목록 조회
post /user - create : 방에 유저 생성
- data
  1. no: 방 번호
delete /:no/user : 방에서 유저 삭제
- data
  1. no: 방 번호


**/invitation**
post / - create : 초대장 생성
- data
  1. roomNo: 방번호
  2. inviteUserNo: 초대 유저 번호
  3. invitedUserNo: 초대받을 유저 번호
get / - find : 초대장 조회
delete /:no - delete : 초대장 삭제
- data
  1. no: 방 번호

**/user**
any /check - check : 로그인 확인
get /:id - find : 유저 조회
- data
  1. id: 유저 아이디

### Web Socket Json schema

- required data
  1. type: 요청 타입명

#### type
JOIN : 방 접속
- data
  1. no - 방번호

SEND : 메시지 전송
- data
  1. content - 내용

INVITE : 유저 초대
- data
  1. no - 초대 받을 유저 번호

EXIT: 방 접속해제

ROOMENTER : 방 입장
- data
  1. no - 방번호
ROOMEXIT : 방 퇴장
- data
  1. no - 방번호
HEART : 접속 유지
- data
  1. no - 방번호

# BROWSER SUPPORT
* chrome
* firefox
* sapari
* samsung internet
