- [nextjs](#nextjs)
  - [tailwind css](#tailwind-css)
  - [usage - font](#usage---font)
  - [usage - app router](#usage---app-router)
  - [usage - metadata](#usage---metadata)
- [superbase setting](#superbase-setting)
  - [install cli](#install-cli)


# nextjs

## tailwind css

```

color
<div className="text-green-500" />;

```

## usage - font

```

```

## usage - app router

app router에서 ()은 페이지 그룹을 의미한다.  
url에 영향을 주는 설정은 아니지만, layout과 같은 예약된 컴포넌트에 영향을 준다.  

```js


```

## usage - metadata

```js
export const metadata: Metadata = {
  title: "Spotify",
  description: "Listen to music",
};
```

# superbase setting

## install cli

ref: https://supabase.com/docs/guides/api/rest/generating-types

```
npm i supabase@">=1.8.1" --save-dev

# make user access token
npx supabase login 

# Project Settings > General settings
# - sxknzhgfshqsjwocxtnc
npx supabase gen types typescript --project-id sxknzhgfshqsjwocxtnc --schema public > types_db.ts


```