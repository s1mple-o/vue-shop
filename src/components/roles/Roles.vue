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
            style="width: 100%"
            border
            stripe>
                <el-table-column
                  type="expand"
                  width="180">
                  <template v-slot:default="slotProps">
                    <el-row>
                      <el-col :span="6">
                        <el-tag closable>{{slotProps.row.roleName}}</el-tag>
                      </el-col>
                      <el-col :span="18">
                        <el-row v-for="item of slotProps.row.children" :key="item.id" class="row-border" >
                          <el-col :span="6" >
                            <el-tag closable type="success">{{item.authName}}</el-tag>
                            </el-col>
                          <el-col :span="18">
                            <el-row v-for="itemChild of item.children" :key="itemChild.id">
                              <el-col :span="8">
                                <el-tag closable type="warning">{{itemChild.authName}}</el-tag>
                              </el-col>
                              <el-col :span="16">
                                <el-row v-for="itemGro of itemChild.children" :key="itemGro.id">
                                  <el-col>
                                    <el-tag closable type="warning">{{itemGro.authName}}</el-tag>
                                  </el-col>
                                </el-row>
                              </el-col>
                            </el-row>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </template>
                </el-table-column>
                <el-table-column
                  type="index"
                  label="#">
                </el-table-column>
                <el-table-column
                  prop="roleName"
                  label="角色名">
                </el-table-column>
                <el-table-column
                  prop="roleDesc"
                  label="角色描述">
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="420">
                   <template v-slot:default="slotProps">
                      <el-button type="primary" icon="el-icon-edit" size='mini' @click="showEditDialog(slotProps.row.id)">编辑</el-button>
                      <el-button type="danger" icon="el-icon-delete" size='mini' @click="deleteRole(slotProps.row.id)">删除</el-button>
                      <el-button type="info" icon="el-icon-setting" size='mini' >设置</el-button>
                   </template>
                </el-table-column>
            </el-table> 
        </el-card>

        <!-- 添加角色弹出框 -->
      <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="40%"
      center
      :close-on-click-modal=false>
      <el-form  label-width="80px" :model="roleParams" :rules="roleRules" ref="roleAddForm">
         <el-form-item label="角色名"  prop="roleName">
           <el-input v-model="roleParams.roleName"></el-input>
         </el-form-item>
         <el-form-item label="描述"  prop="roleDesc">
           <el-input v-model="roleParams.roleDesc"></el-input>
         </el-form-item>
      </el-form>
      <span slot="footer" >
        <el-button @click="closeAddForm('roleAddForm')">取 消</el-button>
        <el-button type="primary" @click="roleAdd('roleAddForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色弹出框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="editDialogVisible"
      width="40%"
      center
      :close-on-click-modal=false>
      <el-form  label-width="80px" :model="editParams" :rules="roleRules" ref="roleEditForm">
         <el-form-item label="角色名"  prop="roleName">
           <el-input v-model="editParams.roleName"></el-input>
         </el-form-item>
         <el-form-item label="描述"  prop="roleDesc">
           <el-input v-model="editParams.roleDesc"></el-input>
         </el-form-item>
      </el-form>
      <span slot="footer" >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole('roleEditForm')">确 定</el-button>
      </span>
    </el-dialog>
   </div>
</template>

<script>
 export default {
   data () {
     return {
         // 角色列表数据
         rolesData:[],
         // 弹出框控制器
         addDialogVisible:false,
         editDialogVisible:false,
         roleParams:{
            roleName:'',
            roleDesc:''
         },
         editParams:{
            roleId:-1,
            roleName:'',
            roleDesc:''
         },
         roleRules:{
           roleName:[
              { required: true, message: '请输入角色名称', trigger: 'blur' },
              { min:2, max:10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
           ],
           roleDesc:[
              { message: '请输入角色描述', trigger: 'blur' },
              { max:100, message: '长度在 0 到 100 个字符', trigger: 'blur' }
           ]
          }
     }
   },
   methods: {
      // 获取角色列表
       async getRolesList(){
           const { data:res } = await this.$axios.get('roles')
           if(res.meta.status !== 200){
             return this.$message(res.meta.msg)
           }
           this.rolesData = res.data
       },
      //  添加角色函数
      roleAdd(formName){
        this.$refs[formName].validate(async (value)=>{
         const { data:res } = await this.$axios.post('roles', this.roleParams)
         console.log(res)
         if(res.meta.status !== 201){
           return this.$message(res.meta.msg)
         }
         this.getRolesList()
         this.addDialogVisible = false
          this.$refs[formName].resetFields()
        })
      },
      // 关闭添加角色框
      closeAddForm(formName){
        this.$refs[formName].resetFields()
        this.addDialogVisible = false
      },
      // 删除角色函数
      deleteRole(id){
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () =>{
          const { data:res } = await this.$axios.delete(`roles/${id}`)
          console.log(res)
          if(res.meta.status !== 200){
            return this.$message(res.meta.status)
          }
           this.getRolesList()
        }).catch(() =>{
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 显示修改框
      async showEditDialog(id){
        this.editDialogVisible = true
        const { data:res } = await this.$axios.get(`roles/${id}`)
        if(res.meta.status !== 200){
          return this.$message(res.meta.msg)
        }
        this.editParams = res.data
      },
      // 修改角色函数
      editRole(formName){
        this.$refs[formName].validate(async (value) =>{
          if(!value){
            return this.$message('输入数据不符合规则')
          }
          const { data:res } = await this.$axios.put(`roles/${this.editParams.roleId}`, this.editParams)
          if(res.meta.status !== 200){
            return this.$message('修改失败')
          }
          this.getRolesList()
          this.editDialogVisible = false
        })
      }
   },
  //  创建周期
   created:function(){
       this.getRolesList()
   }
 }
</script>

<style scoped lang='less'>
.el-breadcrumb{
  margin-bottom: 40px;
}
.el-table{
  margin-top: 20px;
}
.el-row{
  display: flex;
  align-items: center;
}
.el-col{
  margin: 10px 0;
}
.row-border{
  border-top: 1px solid #eee;
}
</style>
