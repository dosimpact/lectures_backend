- [kotlin env settup and basic syntx](#kotlin-env-settup-and-basic-syntx)
- [issue](#issue)


# kotlin env settup and basic syntx 

```
# openjdk 설치, 하지만 brew 로 설치가 잘 안되는것 같다. 아래 이슈 참고
brew install openjdk

# kotlin 설치
brew install kotlin

# kotlin 설치 확인
kotlinc -version

# vscode extension 설치
# vscode extension > Code Runner install
# vscode extension > Kotlin Language insatll
```

# issue 

```
>java
The operation couldn’t be completed. Unable to locate a Java Runtime.
Please visit http://www.java.com for information on installing Java.
```

openjdk 설치로 java가 설치되지 않아, 아래 링크에서 직접 dmg파일로 설치했다. 
- https://velog.io/@dev-mage/simply-run-java-on-an-m1-mac
- Open JDK > https://www.azul.com/downloads/?package=jdk > dmg install

- 혹은, brew install로 가능한듯 ( https://seogineer.tistory.com/96  )
  - brew tap AdoptOpenJDK/openjdk
  - brew search jdk
  - brew install --cask adoptopenjdk11