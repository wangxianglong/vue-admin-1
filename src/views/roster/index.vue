<template>
  <div class="app-container">
    <template>
      <div class="filter-container">
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="3"
          accept="xls"
          :on-exceed="handleExceed">
          <el-button size="small" type="primary">点击上传excel</el-button>
          <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，且不超过500kb</div>
        </el-upload>
        <el-input v-model="searchValue" 
            placeholder="按手机号、工号、姓名搜索" style="width: 200px;" class="filter-item" 
            @keyup.enter.native="handleFilter" />
        <el-button-group>
          <el-button  class="filter-item" type="primary" icon="el-icon-search" @click.native="handleFilter">
            搜索
          </el-button>
          <el-button  class="filter-item" type="primary" icon="el-icon-share" @click.native="resetFilter">
            重置
          </el-button>
        </el-button-group>
        <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="dataDelete">
          删除选中
        </el-button>
      </div>
      <el-table
        :data="isFilter? filterTableData: tableData"
        ref="rosterTable"
        border
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="num"
          label="序号"
          width="50px">
        </el-table-column>
        <el-table-column
          prop="id"
          label="工号">
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
          prop="cardType"
          label="证件类型">
        </el-table-column>
        <el-table-column
          prop="idCard"
          label="身份证号码">
        </el-table-column>
        <el-table-column
          prop="bankCard"
          label="银行卡号">
        </el-table-column>
        <el-table-column
          prop="bank"
          label="开户行">
        </el-table-column>
        <el-table-column
          prop="status"
          label="注册状态"
          width="120"
          :filters="[{ text: '待注册', value: 'stay' }, { text: '注册失败', value: 'error' }, { text: '注册成功', value: 'success' }]"
          :filter-method="filterStatus"
          filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="info"
              icon="el-icon-warning"
              v-show="scope.row.status=='stay'">待注册</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-error"
              v-show="scope.row.status=='error'">注册失败</el-button>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-success"
              v-show="scope.row.status=='success'">注册成功</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="工种"
          :filters="[{ text: '财务', value: '财务' }, { text: '出纳', value: '出纳' }, { text: '经理', value: '经理' }]"
          :filter-method="filterType"
          filter-placement="bottom-end">
        </el-table-column>
        <el-table-column
          prop="state"
          width="100"
          label="状态"
          :filters="[{ text: '禁用', value: 'forbidden' }, { text: '启用', value: 'success' }]"
          :filter-method="filterState"
          filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              v-show="scope.row.state=='forbidden'">禁用</el-button>
            <el-button
              size="mini"
              type="primary"
              v-show="scope.row.state=='success'">启用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

  </div>
  
</template>

<script>
import { getRosterList } from '@/api/table'

export default {
    data() {
      return {
        tableData: [],
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
        isAdd:false,
        date:'',
        tableChecked:[],
        ids:[]
      }
    },
    mounted(){
      getRosterList().then((res)=>{
        this.tableData = res.data.items;
        console.log(res);
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
          // this.tableChecked.forEach((data)=>{

          // })
          // rows.splice(index, 1);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
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
      handleFilter(){
        if(this.searchValue === ''){
          this.isFilter = false;
          return;
        }
        // this.currentPage = 1;
        this.filterTableData = []
        this.filterTableData = this.tableData.filter(data => {
           return (String(data.name).indexOf(String(this.searchValue)) > -1 ||
                   String(data.phone).indexOf(String(this.searchValue)) > -1 ||
                   String(data.id).indexOf(String(this.searchValue)) > -1);
        }),
        // this.total = this.filterTableData.length;
        // this.currentChange(1);
        this.isFilter = true;
      },
      resetFilter(){
        this.isFilter = false;
        // this.total = this.tableData.length;
        // this.currentPage = 1;
        this.searchValue = '';
      },
      filterState(value, row) {
        return row.state === value;
      },
      filterStatus(value, row) {
        return row.status === value;
      },
      filterType(value, row) {
        return row.type === value;
      },
      handleSelectionChange(val) {
        this.tableChecked = val
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
        console.log(1);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      }
    }
}
</script>


<style lang="scss" scoped>
.app-container{
  .upload-demo{
    // display: flex;
    float: left;
  }

  .el-button+.el-button {
    margin-left: 0;
  }

  .filter-container{
    margin-bottom: 10px;
  }
}
</style>


