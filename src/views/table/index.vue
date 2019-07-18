<template>
  <div class="app-container">

    <template>
      <div class="filter-container">
        <el-input v-model="searchValue" 
                  placeholder="请搜索" style="width: 200px;" class="filter-item" 
                  @keyup.enter.native="handleFilter" />
        <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
          添加
        </el-button>
        <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-download" @click="handleCreate">
          导出excel
        </el-button> -->
      </div>
      <el-table
        :data="isFilter? filterTableData: tableData"
        stripe
        style="width: 100%">
        <el-table-column
          prop="num"
          label="序号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="identity"
          label="管理权限"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          width="180">
          <template slot-scope="scope">
            <el-button v-if = "scope.row.state === '启用'"
              @click.native.prevent="stateChange(scope.row)"
              size="mini" type="primary">
              启用
            </el-button>
            <el-button v-if = "scope.row.state === '禁用'"
              @click.native.prevent="stateChange(scope.row)"
              size="mini" type="danger">
              禁用
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="date"
          label="创建日期">
        </el-table-column>
        <el-table-column
          width="180">
          <template slot-scope="scope">
            <el-button 
              @click.native.prevent="dataChange(scope.row,scope.$index)"
              size="mini" type="primary"
              :disabled = "scope.row.state === '禁用'">
              修改
            </el-button>

            <el-button 
              @click.native.prevent="dataDelete(scope.$index,tableData)"
              size="mini" type="danger">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="isAdd?'添加信息':'修改信息'" :visible.sync="dialogFormVisible" :before-close="cancel"> 
        <el-form :model="editData" :rules="rules" ref="editData">
          <el-form-item label="姓名" prop="name" class="demo-ruleForm">
            <el-input v-model="editData.name"></el-input>
          </el-form-item>
          <el-form-item label="管理权限">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel()">取 消</el-button>
          <el-button type="primary" @click="isAdd? handleCreated(editData):dataChanged(editData)">确 定</el-button>
        </div>
      </el-dialog>
    </template>

  </div>
  
</template>

<script>
import { getList } from '@/api/table'

export default {
    data() {
      return {
        tableData: [{
          num: 1,
          date: '2016-05-02',
          name: '王小虎',
          identity: '管理员',
          state:'启用'
        }, {
          num: 2,
          date: '2016-05-04',
          name: '韩梅梅',
          identity: '普通用户',
          state:'启用'
        }, {
          num: 3,
          date: '2016-05-01',
          name: '李磊',
          identity: '普通用户',
          state:'禁用'
        }, {
          num: 4,
          date: '2016-05-03',
          name: '李雷',
          identity: '普通用户',
          state:'启用'
        }],
        dialogFormVisible: false,
        editRowIndex: -1,
        editData: {
          name:'',
          identity:''
        },
        options: [{
          value: '管理员',
          label: '管理员'
        }, {
          value: '普通用户',
          label: '普通用户'
        }],
        value:0,
        searchValue:'',
        rules: {
          name: [
            { required: true, message: '姓名不能为空', trigger: 'change' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'change' }
        ]},
        filterTableData:[],
        isFilter: false,
        isAdd:false
      }
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
          row.state=(row.state === '启用' ? '禁用' : '启用');
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
        this.editData.name = row.name;
        this.editData.identity = row.identity;
        this.value = row.identity;
        this.dialogFormVisible = true
      },
      dataChanged(editData){
        this.$refs['editData'].validate((valid) => {
          if (valid) {
            this.dialogFormVisible = false;
            Object.keys(this.editData).forEach((key)=>{
              if(key === 'identity'){
                this.tableData[this.editRowIndex][key] = this.value;
              }else{
                this.tableData[this.editRowIndex][key] = this.editData[key];
              }
            })
            this.editData ={
              name:'',
              identity:''
            }
          }
        })
      },
      cancel(){
        this.dialogFormVisible = false;
        this.editData = {
          name:'',
          identity:''
        },
        this.value = -1;
      },
      handleFilter(){
        if(this.searchValue === ''){
          this.isFilter = false;
        }
        this.filterTableData = []
        this.filterTableData = this.tableData.filter(data => {
           return String(data.name).indexOf(String(this.searchValue)) > -1;
        }),
        this.isFilter = true;
      },
      handleCreate(){
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
      handleCreated(editData){
        this.$refs['editData'].validate((valid) => {
          if(valid){
            var newData = new Object;
            newData.name = editData.name;
            newData.identity = this.value;
            newData.date = this.dateToString(new Date());
            newData.state = '启用';
            newData.num = this.tableData.length+1;
            this.tableData.push(newData);
            this.dialogFormVisible = false;
            this.isAdd = false;
          }
        })
      },
      // handleDownload() {
      // // this.downloadLoading = true
      //   import('@/vendor/Export2Excel').then(excel => {
      //     const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date']
      //     const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time']
      //     const list = this.list
      //     const data = this.formatJson(filterVal, list)
      //     excel.export_json_to_excel({
      //       header: tHeader,
      //       data,
      //       filename: this.filename,
      //       autoWidth: this.autoWidth,
      //       bookType: this.bookType
      //     })
      //   // this.downloadLoading = false
      // })

    },
}
</script>
