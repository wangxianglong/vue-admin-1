<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="searchValue.byName" 
          placeholder="按姓名搜索" style="width: 200px;" class="filter-item" 
          @keyup.enter.native="handleFilter" />
      <el-input v-model="searchValue.byPhone" 
          placeholder="按手机号码搜索" style="width: 200px;" class="filter-item" 
          @keyup.enter.native="handleFilter" />
      <el-select v-model="searchValue.byIdentity" placeholder="按角色搜索">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button-group>
        <el-button  class="filter-item" type="primary" icon="el-icon-search" @click.native="handleFilter">
          搜索
        </el-button>
        <el-button  class="filter-item" type="primary" icon="el-icon-share" @click.native="resetFilter">
          重置
        </el-button>
      </el-button-group>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="dataCreate">
        添加
      </el-button>
    </div>
    <el-table
      :data="isFilter? filterTableData.slice((currentPage-1)*pagesize,currentPage*pagesize) : tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      stripe
      style="width: 100%">
      <el-table-column
        prop="num"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号码">
      </el-table-column>
      <el-table-column
        prop="mail"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="identity"
        label="角色">
      </el-table-column>        
      <el-table-column
        prop="state"
        label="状态">
        <template slot-scope="scope">
          <el-button v-if = "scope.row.state === '正常'"
            @click.native.prevent="stateChange(scope.row)"
            size="mini" type="primary">
            正常
          </el-button>
          <el-button v-if = "scope.row.state === '禁用'"
            @click.native.prevent="stateChange(scope.row)"
            size="mini" type="danger">
            禁用
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="lastDate"
        label="最后操作时间">
      </el-table-column>
      <el-table-column
        prop="pwd"
        label="登录密码">
      </el-table-column>
      <el-table-column
        width="180">
        <template slot-scope="scope">
          <el-button 
            @click.native.prevent="dataChange(scope.row,scope.$index)"
            size="mini" type="primary">
            <!-- :disabled = "scope.row.state === '禁用'"> -->
            编辑
          </el-button>
          <el-button 
            @click.native.prevent="dataDelete(scope.$index,tableData)"
            size="mini" type="danger">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="current_change">
    </el-pagination>
    <el-dialog :title="isAdd?'添加信息':'修改信息'" :visible.sync="dialogFormVisible" :before-close="cancel"> 
      <el-form :model="editData" :rules="rules" ref="editData">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editData.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="editData.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model="editData.mail"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="identity" class="form-identity">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="登录密码" prop="pwd">
          <el-input v-model="editData.pwd"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="isAdd? dataCreated():dataChanged()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
  
</template>

<script>
import { validatePhone,validateMail,validatePassword } from '@/utils/validate'
import { getList } from '@/api/table'

export default {
    data() {
      return {
        tableData: [],
        dialogFormVisible: false,
        editRowIndex: -1,
        editData: {
          num: '',
          name: '',
          phone: '',
          mail: '',
          identity: '',
          createDate: '',
          lastDate: '',
          pwd : ''
        },
        searchValue:{
          byName:'',
          byPhone:'',
          byIdentity:''
        },
        options: [{
          value: '管理员',
          label: '管理员'
        }, {
          value: '普通用户',
          label: '普通用户'
        }],
        value:0,
        rules: {
          name: [
            { required: true, message: '姓名不能为空', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
          ],
          phone: [
            { required: true, trigger: 'blur', validator: validatePhone }
          ],
          mail: [
            { required: true, trigger: 'blur', validator: validateMail }
          ],
          pwd: [
            { required: true, trigger: 'blur', validator: validatePassword }
          ]},
        filterTableData:[],
        isFilter: false,
        isAdd:false,
        total: 0,
        pagesize:10,
        currentPage:1
      }
    },
    created(){
      getList().then((res) => {
        this.tableData = res.data.items;
        this.total = res.data.total;
      })
    },
    methods:{
      stateChange(row){
        this.$confirm('此操作将改变用户状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
          row.state=(row.state === '正常' ? '禁用' : '正常');
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消修改'
          });          
        });

      },
      dataDelete(index, rows) {
        this.$confirm('此操作将删除用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          rows.splice(index, 1);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      dataChange(row,index){
        this.editRowIndex = index;
        this.editData = row;
        this.value = row.identity;
        this.dialogFormVisible = true
      },
      dataChanged(){
        this.$refs['editData'].validate((valid) => {
          if (valid) {
            this.tableData[this.editRowIndex] = this.editData;
            this.tableData[this.editRowIndex]['identity'] = this.value;
            this.cancel();
          }
        })
      },
      cancel(){
        this.dialogFormVisible = false;
        this.editData = {
          name: '',
          phone: '',
          mail: '',
          identity: '',
          pwd: ''
        },
        this.value = -1;
        this.$refs['editData'].clearValidate();
      },
      handleFilter(){
        if(this.searchValue.byName === '' && this.searchValue.byPhone === '' && this.searchValue.byIdentity === ''){
          this.isFilter = false;
          return;
        }
        this.filterTableData = []
        this.filterTableData = this.tableData.filter(data => {
           return (String(data.name).indexOf(String(this.searchValue.byName)) > -1 &&
                   String(data.phone).indexOf(String(this.searchValue.byPhone)) > -1 &&
                   String(data.identity).indexOf(String(this.searchValue.byIdentity)) > -1);
        }),
        this.total = this.filterTableData.length;
        this.isFilter = true;
      },
      resetFilter(){
        this.isFilter = false;
        this.total = this.tableData.length;
        this.searchValue.byName = '';
        this.searchValue.byPhone = '';
        this.searchValue.byIdentity ='';
      },
      dataCreate(){
        this.isAdd = true;
        this.dialogFormVisible = true;
        this.value = "管理员";
      },
      dateToString(date){ 
        var year = date.getFullYear(); 
        var month =(date.getMonth() + 1).toString(); 
        var day = (date.getDate()).toString();  
        if (month.length == 1) { 
            month = "0" + month; 
        } 
        if (day.length == 1) { 
            day = "0" + day; 
        }
        var dateTime = year + "-" + month + "-" + day;
        return dateTime; 
      },
      dataCreated(editData){
        this.$refs['editData'].validate((valid) => {
          if(valid){
            let newData = this.editData;          
            newData.identity = this.value;
            newData.createDate = this.dateToString(new Date());
            newData.lastDate = this.dateToString(new Date());
            newData.state = '正常';
            // newData.num = this.tableData.length + 1;
            this.tableData.push(JSON.parse(JSON.stringify(newData)));
            this.dialogFormVisible = false;
            this.isAdd = false;
          }
        })
      },
      current_change(currentPage){
        this.currentPage = currentPage;
      },

    },
}
</script>

<style lang="scss" scoped>

.filter-container{
  height: 40px;
  .el-button{
    height: 40px;
  }
}
.el-form-item{
  margin-bottom: 10px;
}
.form-identity{
  margin-top: 20px;
}
</style>
