<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }" >首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      </el-breadcrumb>
    <el-card class="box-card">
    
    <el-row>
      <el-col :span='8'>
        <el-input placeholder="请输入内容" v-model="queryParams.query" class="input-with-select" clearable>
          <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
        </el-input>
      </el-col>
      <el-col :span='16'>
        <el-button round  @click="addDialogVisible = true">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 用户列表 -->
    <el-table
      border
      :data="tableData"
      style="width: 100%">
      <el-table-column
        type="index"
        label="#">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="role_name"
        label="权限">
      </el-table-column>
      <el-table-column
        prop="mg_state"
        label="状态">
        <template v-slot:default="slotProps">
          <el-switch
          v-model="slotProps.row.mg_state"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="userStateChange(slotProps.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template v-slot:default="slotProps">
          <el-tooltip class="item" effect="dark" content="修改" placement="top">
          <el-button type="primary" icon="el-icon-edit" circle @click="showModify(slotProps.row.id)" ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteUserByID(slotProps.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="设置" placement="top">
            <el-button type="danger" icon="el-icon-setting" circle></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage">
    </el-pagination>
    </el-card>

    <!-- 弹出框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="40%"
      center
      :close-on-click-modal=false>
      <el-form  label-width="80px" :model="userParams" :rules="userRules" ref="userAddForm">
         <el-form-item label="用户名"  prop="username">
           <el-input v-model="userParams.username"></el-input>
         </el-form-item>
         <el-form-item label="密码"  prop="password">
           <el-input type="password" v-model="userParams.password"></el-input>
         </el-form-item>
         <el-form-item label="邮件"  prop="email">
           <el-input v-model="userParams.email"></el-input>
         </el-form-item>
         <el-form-item label="电话"  prop="mobile">
           <el-input v-model.number="userParams.mobile"></el-input>
         </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="userAdd('userAddForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改弹出框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="modifyDialogVisible"
      width="40%"
      center
      :close-on-click-modal=false>
      <el-form  label-width="80px" :model="modifyUserParams" :rules="userRules" ref="userModifyForm">
         <el-form-item label="用户名"  >
           <el-input v-model="modifyUserParams.username" disabled></el-input>
         </el-form-item>
         <el-form-item label="邮件"  prop="email">
           <el-input v-model="modifyUserParams.email"></el-input>
         </el-form-item>
         <el-form-item label="电话"  prop="mobile">
           <el-input v-model.number="modifyUserParams.mobile"></el-input>
         </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="userModify('userModifyForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
 export default {
   data () {
     const checkMobile = (rule, value, callback) =>{
       if(!(/^1[3456789]\d{9}$/.test(value))){
         return callback(new Error('电话号码不符合规则'))
       }else{
         callback()
       }
     }
     return {
       tableData:[],
       currentPage:1,
       totalPage:0,
       queryParams:{
        query:'',
        pagenum:1,
        pagesize:5
       },
       addDialogVisible:false,
       modifyDialogVisible:false,
       modifyUserParams:{
          username:'',
          email:'',
          mobile:''
       },
       userParams:{
          username:'',
          password:'',
          email:'',
          mobile:''
        },
        userRules:{
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
           password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'change' }
          ],
           email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
           { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ],
           mobile: [
            { required: true, message: '请输入电话', trigger: 'blur' },
            { validator: checkMobile, trigger: ['blur', 'change'] }
          ]
        }
     }
   },
   methods: {
     async getUsersList(){
       const { data:res } = await this.$axios.get('users', { params:this.queryParams })
      if(res.meta.status !== 200){
        this.$message('获取用户列表错误')
        return false
      }
      for(const item of res.data.users){
          item.create_time = this.dateFormat(item.create_time, 'yyyy-MM-dd')
      }
      this.tableData = res.data.users
      this.totalPage = res.data.total
      this.pageSize = res.data.pagesize ? res.data.pagesize : 1
     },
     handleSizeChange(val) {
       this.queryParams.pagesize = val
       this.getUsersList()
      },
      handleCurrentChange(val) {
        this.queryParams.pagenum = val
        this.getUsersList()
      },
      dateFormat(date, fmt){
        date = new Date(date)
        var o = {
            'M+' : date.getMonth() + 1,
            'd+' : date.getDate(),                   
            'h+' : date.getHours(),                  
            'm+' : date.getMinutes(),                
            's+' : date.getSeconds(),                
            'q+' : Math.floor((date.getMonth() + 3) / 3),
            'S"' : date.getMilliseconds()            
        }
        if(/(y+)/.test(fmt)){
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        for(var k in o){
            if(new RegExp('(' + k + ')').test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
            }
        }
        return fmt
    },
    async userStateChange(user){
      const { data : res } = await this.$axios.put(`users/${user.id}/state/${user.mg_state}`)
      if(res.meta.status !== 200){
        this.$message('设置错误')
        return false
      }
      this.$message(res.meta.msg)
    },
    userAdd(formName){
      this.addDialogVisible = false
      this.$refs[formName].validate(async (valid)=>{
        if(valid){
           const { data: res } = await this.$axios.post('users', this.userParams)
           if(res.meta.status !== 201){
            this.$message('添加失败')
            return false
          }
          this.$message(res.meta.msg)
        }else{
          this.$message('填写错误')
        }
      })
    },
    async showModify(id){
      const { data:res } = await this.$axios.get(`users/${id}`)
      if(res.meta.status === 200){
        this.modifyUserParams = res.data
        this.modifyDialogVisible = true
      }else{
        this.$message('编辑页面获取失败')
      }
    },
    userModify(formName){
      this.$refs[formName].validate(async (value)=>{
         console.log(value)
        if(value){
        const { data:res } = await this.$axios.put(`users/${this.modifyUserParams.id}`, this.modifyUserParams)
          if(res.meta.status === 200){
            this.modifyDialogVisible = false
            this.getUsersList()
          }else{
            this.$message(res.meta.status)
          }
        }else{
          this.$message('邮箱或电话错误')
        }
      })
    },
    deleteUserByID(id){
       this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { data:res } = await this.$axios.delete(`users/${id}`)
          console.log(res)
          if(res.meta.status === 200){
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
             this.getUsersList()
          }else{
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })          
        })
    }
   },
   created:function(){
     this.getUsersList()
   }
 }
</script>

<style scoped lang='less'>
.el-breadcrumb{
  margin-bottom: 40px;
}
.el-pagination{
  margin-top: 20px;
}
.el-col{
  display: flex;
  justify-content: flex-end;
}
.el-table{
  margin-top: 20px;
}
</style>
