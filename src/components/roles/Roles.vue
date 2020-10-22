<template>
   <div>
       <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }" >首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        
        <!-- 列表卡片 -->
        <el-card class="box-card">
            <el-button round  @click="addDialogVisible = true" type="primary">添加用户</el-button>

            <!-- 角色列表 -->
            <el-table
            :data="rolesData"
            style="width: 100%">
                <el-table-column
                  type="expand"
                  width="180">
                </el-table-column>
                <el-table-column
                  type="index"
                  label="#"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="roleName"
                  label="角色名"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="roleDesc"
                  label="角色描述">
                </el-table-column>
                <el-table-column
                  label="操作">
                    <el-button type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete">删除</el-button>
                </el-table-column>
            </el-table>
        </el-card>
   </div>
</template>

<script>
 export default {
   data () {
     return {
         rolesData:[]
     }
   },
   methods: {
       async getRolesList(){
           const { data:res } = await this.$axios.get('roles')
           console.log(res)
           this.rolesData = res.data
       }
   },
   created:function(){
       this.getRolesList()
   }
 }
</script>

<style scoped lang='less'>
.el-breadcrumb{
  margin-bottom: 40px;
}
</style>
