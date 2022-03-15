## install & start

```
npm i 
npm run start:dev
```

## configure 

```
// eslint
yarn add -D eslint
npx eslint --init

// prettier
yarn add -D prettier eslint-config-prettier eslint-plugin-prettier

// dotenv
yarn add dotenv cross-env

// nodemon
yarn add nodemon
     "start:dev": "cross-env NODE_ENV=development nodemon --exec babel-node src/app.js",
        croess-env 변수 하에 nodemon이 실행 ( parent-child process? 개념인가)
            그래고 nodemon이 실행하는 프로세스는 babel-node 이다. 
                balel-node는 스크립트는 app.js를 트랜스파일링 후  런타임에 돌리는 node 프로세스이다.

// express
yarn add express cors body-parser cookie-parser morgan helmet
yarn add multer
```


## IssueLog

### express root error handling - Fail

- 서버 요청시 - 비동기 함수 호출을 await 하지 않고, 클라 요청이 끝나고 나중에 비동기 처리에서 오류가 나온 경우


### frontend filedownload 

- 필수 기능 : image serve, file download
- a 태그에 download 붙여도 , dialog를 통한 다운로드가 안되는 경우 있다. 
- 서버측에서 header 를 설정 -> https://stackoverflow.com/questions/50694881/how-to-download-file-in-react-js 
- blob concept

문제점      
```
express.static.file 의 파일 타입에 따라서 브라우저가 다르게 반응한다.  
    Content-Type : image/jpeg  // 새창에서 이미지를 보여준다.
    Content-Type : application/octet-stream // 텍스트 파일인데, 같은 창에서 텍스트파일을 연다.  
```
해결  

```
		접근1. Content-Disposition: attachment 을 이용하기
			--> 작동하지 않는다.
		
		https://stackoverflow.com/questions/50694881/how-to-download-file-in-react-js
	
		
		프론트엔드에서, 브라우저 다운로드를 트리거 하는것은 신뢰할 수 없다.
			"다운로드" 속성은 , 파일 유형에 대해 새탭에서 열도록 함.
		
		https://stackoverflow.com/questions/20508788/do-i-need-content-type-application-octet-stream-for-file-download/20509354#20509354
	
		
		콘텐츠 유형을 알고 있는 경우, Content-Type 을 셋팅해주는것이 맞다.
			application/octet-stream 은, 임의의 이진 데이터로 정의 - 목적은 디스크 저장
		
		
			Content-Type: application/octet-stream
            Content-Disposition: attachment; filename="picture.png"
			"도대체 이게 뭔지 모르겠어. 파일로 저장해 줘, 가급적이면 picture.png라는 이름으로 저장하세요"를 의미합니다.
			
			Content-Type: image/png
            Content-Disposition: attachment; filename="picture.png"
			"이것은 PNG 이미지입니다. 파일로 저장하십시오. 가급적이면 picture.png라는 이름으로 저장하십시오."
			
			Content-Type: image/png
            Content-Disposition: inline; filename="picture.png"
			"이것은 PNG 이미지입니다. PNG 이미지를 표시하는 방법을 모르는 경우가 아니면 표시하십시오.
			 그렇지 않으면 사용자가 저장하기로 선택한 경우 저장할 파일에 대해 picture.png라는 이름을 권장합니다."를 의미합니다.
		
		접근2. Axios 을 이용한, blob 응답타입으로 요청하기
			--> 된다.!
			--> 서버측에서, 구지 헤더설정을 Content-Disposition: attachment 로 안해도 된다.!
			
		
		  function download() {
		    axios({
		      url: 'http://localhost:4000/api/static/007070.jpg',
		      method: 'GET',
		      responseType: 'blob',
		    }).then((response) => {
		      const url = window.URL.createObjectURL(new Blob([response.data]));
		      const link = document.createElement('a');
		      link.href = url;
		      link.setAttribute('download', 'image.jpg');
		      document.body.appendChild(link);
		      link.click();
		    });
		  }
		  useEffect(() => {
		    download();
		    return () => {};
  }, []);
```