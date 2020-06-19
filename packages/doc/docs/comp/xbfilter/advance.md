## 网络配置

默认内部配置的是 axios 原生对象<br />如果当前方法需要携带框架层级的一些信息，如 header、cookie 等，内部提供了 axiosService 配置

```typescript
Vue.prototype.$axiosService = yourAxiosService
Vue.use(xbui)
```

## 级联问题

> 目前转换为父子级组件的问题，支持多层子级的情况如 `A>B>C`

```typescript
{
  key:'father',
  son:'son'
},
{
  key: 'son',
  father: 'father',
  son: 'grandson'
},
{
  key: 'grandson',
  father:'son',
}
```

也支持一父多子的情况 如  `A>(B+C)`

```typescript
{
  key: 'father',
  son: ['son1','son2'],
  list: [{
  	label:'大儿子',
    value:1,
    son:'son1'
  },{
  	label:'二儿子',
    value:2,
    son:'son2'
  }]
},
{
  key: 'son1',
  father: 'father'
},
{
  key: 'son2',
  father: 'father'
}
```
