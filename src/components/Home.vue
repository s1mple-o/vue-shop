<template>
<el-container>
  <el-header>
    <div>
      <img src="../assets/logo.png" >
      <span>电商后台管理系统</span>
      <el-button round @click="back">退出</el-button>
    </div>
  </el-header>
  <el-container>
    <el-aside width="200px">
      <el-menu :default-active="currentActive" class="el-menu-vertical-demo" unique-opened  :collapse="isCollapse" :collapse-transition="false" router>
        <!-- <div class="mune-control">
          <i class="el-icon-s-fold"></i>
        </div> -->
        <!-- <el-menu-item  @click="changeCollapse" >
            <i class="el-icon-s-fold"></i>
            <span>收起菜单栏</span>
        </el-menu-item> -->
        <div class="mune-control"  @click="changeCollapse">
           <i class="el-icon-s-fold"></i>
        </div>
        <el-submenu  v-for="item in this.munes" :key="item.id" :index="item.id+''" >
          <template slot="title">
            <i :class="iconObjs[item.id]"></i>
            <span>{{item.authName}}</span>
          </template>
          <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveCurrent(subItem.path)">
            <i class="el-icon-menu"></i>
            <span>{{subItem.authName}}</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
  <el-container>
    <el-main >
      <router-view></router-view>
    </el-main>
  </el-container>
  </el-container>
</el-container>
</template>

<script>
export default {
  data(){
    return {
      munes:[],
      iconObjs:{
        125:'el-icon-user-solid',
        103:'el-icon-lock',
        101:'el-icon-s-goods',
        102:'el-icon-s-claim',
        145:'el-icon-s-data'
      },
      isCollapse:false,
      currentActive:''
    }
  },
  methods:{
      back(){
          window.sessionStorage.clear('token')
          this.$router.push('/login')
      },
      async getMuneList(){
        const { data:res } = await this.$axios.get('menus')
        this.munes = res.data
      },
      changeCollapse(){
        this.isCollapse = !this.isCollapse
      },
      saveCurrent(path){
        window.sessionStorage.setItem('path', '/' + path)
      }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
  },
  created: function(){
    this.getMuneList()
    this.currentActive = window.sessionStorage.getItem('path')
  },
  mounted:function(){
  }
}
</script>

<style lang="less" scoped>
.el-header{
  height:100px!important;
  div{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    img{
      width: 80px;
      height: 80px;
    }
    span{
      font-size: 28px;
      font-style: 700;
      color: #fff;
      margin-left: 40px;
    }
  }
}
.el-container{
  height: 100%;
}
.el-header{
  background-color: #373d41;
}
.el-aside{
 background-color: #eaedf1;
  .el-menu{
    height: 100%;
  }
}
.el-main{
  background-color: #eaedf1;
}
.el-submenu{
  margin-top:20px;
}
.mune-control{
  width: 100%;
  height: 40px;
  position: relative;
  i{
    position: absolute;
    top: 45%;
    left: 40%;
    font-size: 20px;
  }
}
</style>
