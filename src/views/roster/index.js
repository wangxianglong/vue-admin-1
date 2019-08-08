import url from "@/api/api.js";
import {
  validatePhone,
  validateId
} from "@/utils/validate";
export default {
  data() {
    return {
      tableData: [], //表格数据
      total: -1, //总数据量
      currentPage: 1, //分页当前页数
      loading: false, //加载数据时显示动效
      pageSize: 10, //一页数据量
      pageNum: 1, //第几页
      customerId: 3,
      //表单验证规则
      rules: {
        fullName: [{
            required: true,
            message: "姓名不能为空",
            trigger: "blur"
          },
          {
            min: 2,
            max: 5,
            message: "长度在 2 到 5 个字符",
            trigger: "blur"
          }
        ],
        mobile: [{
          required: true,
          trigger: "blur",
          validator: validatePhone
        }],
        idCard: [{
          required: true,
          trigger: "blur",
          validator: validateId
        }]
      },
      isAdd: false, //添加还是编辑
      editRowIndex: -1, //表格编辑行索引
      //添加、编辑数据
      editData: {
        jobNumber: "q",
        fullName: "qiukju",
        sex: "女",
        mobile: "157576651456",
        idType: "身份证",
        bankAccount: "1111",
        bankName: "1111",
        idCard: "330181199309298826",
        registerStatus: "0",
        typeOfWork: "11",
        state: ""
      },
      //查看数据
      checkData: "",
      tableChecked: [], //选中的表格行数
      checkedMobiles: [], //选中的手机号
      uploadType: "1", //上传类型
      filterType: "", //查询还是过滤
      //查询数据
      mobileValue: "",
      jobNumberValue: "",
      fullNameValue: "",
      //过滤数据
      filterDatas: {
        registerStatus: [],
        state: [],
        typeOfWork: []
      },
      //模态框控制
      checkUserFormVisible: false,
      userFormVisible: false
    };
  },
  mounted() {

    this.getDataLists();
  },
  methods: {
    //单条删除
    deleteUserData(index, rows) {
      this.$confirm("此操作将删除用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          this.checkedMobiles = [];
          this.checkedMobiles.push(rows[index].mobile);
          this.$axios
            .post(url.rosterDelete, {
              mobiles: this.checkedMobiles,
              customerId: this.customerId
            })
            .then(res => {
              console.log(res);
              if (res.status === 200) {
                if (res.data.result === 1) {
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                  if (this.filterType === "search") {
                    this.handleSearch(this.pageNum);
                  } else {
                    if (this.filterType === "filter") {
                      this.handleFilter(this.pageNum);
                    } else {
                      this.getDataLists();
                    }
                  }
                } else {
                  this.$message.error(res.data.msg);
                }
              } else {
                this.$message.error("删除失败");
              }
            })
            .catch(error => {
              this.$message.error("删除失败");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //批量删除
    deleteUserDatas() {
      this.$confirm("此操作将删除选中用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          this.checkedMobiles = [];
          for (let key in this.tableChecked) {
            this.checkedMobiles.push(this.tableChecked[key].mobile);
          }
          this.$axios
            .post(url.rosterDelete, {
              mobiles: this.checkedMobiles,
              customerId: this.customerId
            })
            .then(res => {
              console.log(res);
              if (res.status === 200) {
                if (res.data.result === 1) {
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                  if (this.checkedMobiles.length === this.tableData.length) {
                    if (this.pageNum > 1) {
                      this.pageNum--;
                    }
                  }
                  if (this.filterType === "search") {
                    this.handleSearch(this.pageNum);
                  } else {
                    if (this.filterType === "filter") {
                      this.handleFilter(this.pageNum);
                    } else {
                      this.getDataLists();
                    }
                  }
                } else {
                  this.$message.error(res.data.msg);
                }
              } else {
                this.$message.error("删除失败");
              }
            })
            .catch(error => {
              this.$message.error("删除失败");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //全部删除
    deleteUserDataAll() {
      this.$confirm("此操作将删除全部用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          this.$axios
            .post(url.rosterDeleteAll, {
              customerId: this.customerId
            })
            .then(res => {
              console.log(res);
              if (res.status === 200) {
                if (res.data.result === 1) {
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                  this.getDataLists();
                } else {
                  this.$message.error(res.data.msg);
                }
              } else {
                this.$message.error("删除失败");
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //根据手机号，真实姓名，工号模糊查询
    handleSearch(pageNum) {
      this.$axios
        .get(url.rosterSearch, {
          params: {
            customerId: this.customerId,
            mobile: this.mobileValue,
            jobNumber: this.jobNumberValue,
            fullName: this.fullNameValue,
            pageNum: pageNum,
            pageSize: this.pageSize
          }
        })
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            if (res.data.result === 1) {
              this.filterType = "search";
              if (pageNum === 1) {
                this.pageNum = 1;
                this.currentPage = 1;
              }
              this.tableData = res.data.data.list;
              this.total = res.data.data.total;
            } else {
              this.$message.error(res.data.msg);
            }
          } else {
            this.$message.error("查询失败");
          }
        });
    },
    //根据承揽人注册状态、工种、状态过滤分组查询
    handleFilter(pageNum) {
      this.$axios
        .get(url.rosterFilter, encodeURIComponent({
          params: {
            customerId: this.customerId,
            registerStatusS: JSON.stringify(this.filterDatas.registerStatus),
            statusS: JSON.stringify(this.filterDatas.state),
            typeOfWorkS: JSON.stringify(this.filterDatas.typeOfWork),
            pageSize: pageNum,
            pageNum: this.pageNum
          }
        }))
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            if (res.data.result === 1) {
              this.filterType = "filter";
              if (pageNum === 1) {
                this.pageNum = 1;
                this.currentPage = 1;
              }
              this.tableData = res.data.data.list;
              this.total = res.data.data.total;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //重置
    resetFilter() {
      this.pageNum = 1;
      this.getDataLists();
      (this.mobileValue = ""),
      (this.jobNumberValue = ""),
      (this.fullNameValue = "");
      this.filterType = "";
    },
    //获取过滤数据
    filterStatus(filters) {
      for (var key in filters) {
        this.filterDatas[key] = filters[key];
      }
      this.handleFilter(1);
    },
    //获取选中的表格行
    handleSelectionChange(val) {
      this.tableChecked = val;
    },
    //获取数据列表
    getDataLists() {
      this.loading = true;
      this.$axios
        .get(url.rosterLists, {
          params: {
            customerId: this.customerId,
            pageSize: this.pageSize,
            pageNum: this.pageNum
          }
        })
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            if (res.data.result === 1) {
              if (res.data.data.list.length <= 0 && this.pageNum > 1) {
                this.pageNum--;
                this.getDataLists();
              } else {
                this.tableData = res.data.data.list;
                this.total = res.data.data.total;
              }
            } else {
              this.$message.error(res.data.msg);
            }
          } else {
            this.$message.error("获取数据出错！");
          }
          this.loading = false;
        })
        .catch(erroe => {
          this.$message.error("获取数据出错！");
          this.loading = false;
        });
    },
    //改变页数
    paginationChange(currentPage) {
      this.pageNum = currentPage;
      if (this.filterType === "search") {
        this.handleSearch(this.pageNum);
      } else {
        if (this.filterType === "filter") {
          this.handleFilter(this.pageNum);
        } else {
          this.getDataLists();
        }
      }
    },
    //改变每页数据量
    handleSizeChange(size) {
      this.pageSize = size;
      this.pageNum = 1;
      this.getDataLists();
    },
    //上传文件
    beforeUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "xls";
      const extension2 = testmsg === "xlsx";
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!extension && !extension2) {
        this.$message({
          message: "上传文件只能是 xls、xlsx格式!",
          type: "warning"
        });
        return false;
      }
      if (!isLt5M) {
        this.$message({
          message: "上传文件大小不能超过 5MB!",
          type: "warning"
        });
        return false;
      }
      let fd = new FormData();
      fd.append("file", file); //传文件
      fd.append("customerId", this.customerId);
      fd.append("importId", this.uploadType);
      this.$axios.post(url.rosterImportExcel, fd).then(res => {
        console.log(res);
        if (res.status === 200) {
          if (res.data.result === 1) {
            this.getDataLists();
            this.$message.success("上传成功");
          } else {
            this.$message.error(res.data.msg);
          }
        } else {
          this.$message.error("上传失败");
        }
      });
    },
    //文件个数限制
    handleExceed(files, fileList) {
      this.$message.warning("一次只能上传一个文件");
    },
    //确定上传
    newSubmitForm() {
      this.$refs.newupload.submit();
    },
    //查看用户
    checkUserData(row, index) {
      this.checkUserFormVisible = true;
      let rowData = row;
      this.checkData = JSON.parse(JSON.stringify(rowData));
    },

    //添加用户
    addUserData() {
      this.isAdd = true;
      this.userFormVisible = true;
      // for (let key in this.editData) {
      //   this.editData[key] = "";
      // }
      // this.$refs["editData"].clearValidate();
    },
    //确定添加用户
    addUserDataTrue() {
      this.$refs["editData"].validate(valid => {
        if (valid) {
          let newData = this.editData;
          newData.customerId = this.customerId;
          this.$axios.post(url.rosterAdd, newData).then(res => {
            console.log(res);
            this.userFormVisible = false;
            this.isAdd = false;
            if (res.status === 200) {
              if (res.data.result === 1) {
                if (this.filterType === "search") {
                  this.handleSearch(this.pageNum);
                } else {
                  if (this.filterType === "filter") {
                    this.handleFilter(this.pageNum);
                  } else {
                    this.getDataLists();
                  }
                }
                this.$message.success("添加成功");
              } else {
                this.$message.error(res.data.msg);
              }
            } else {
              this.$message.error("添加失败");
            }
          });
        }
      });
    },
    //编辑用户
    editUserData(row, index) {
      this.isAdd = false;
      this.editRowIndex = index;
      this.userFormVisible = true;
      let rowData = row;
      this.editData = JSON.parse(JSON.stringify(rowData));
    },
    //确定编辑用户
    editUserDataTrue() {
      this.$axios
        .post(url.rosterEdit, {
          mobile: this.editData.mobile,
          customerId: this.customerId,
          sex: this.editData.sex,
          typeOfWork: this.editData.typeOfWork,
          jobNumber: this.editData.jobNumber
        })
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            if (res.data.result === 1) {
              this.tableData[this.editRowIndex] = JSON.parse(
                JSON.stringify(this.editData)
              );
            } else {
              this.$message.error(res.data.msg);
            }
          } else {
            this.$message.error("编辑失败");
          }
          this.cancel();
        });
    },
    //取消添加、编辑
    cancel() {
      this.userFormVisible = false;
      for (let key in this.editData) {
        this.editData[key] = "";
      }
      this.$refs["editData"].clearValidate();
    }
  }
};
