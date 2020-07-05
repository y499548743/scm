<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="checkTab">
      <el-tab-pane label="货到付款" name="first"></el-tab-pane>
      <el-tab-pane label="款到发货" name="second"></el-tab-pane>
      <el-tab-pane label="预付款到发货" name="third"></el-tab-pane>
    </el-tabs>
    <el-table :data="tableData" stripe style="100%">
      <el-table-column prop="ordinal" label="序号" width="50px">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="poId" label="采购单编号" width="140px">
        <template slot-scope="scope">
          <span @click="showPoitems(scope.$index, scope.row)">{{scope.row.poId}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="160px">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="venderName" label="供应商名称" width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.venderName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="account " label="创建用户" width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.account}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tipFee" label="附加费用" width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.tipFee}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="productTotal" label="产品总价" width="70px">
        <template slot-scope="scope">
          <span>{{scope.row.productTotal}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="poTotal" label="销售单总价格" width="70px">
        <template slot-scope="scope">
          <span>{{scope.row.poTotal}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="payType" label="付款方式" width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.payType|paytype}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="prePayFee" label="最低预付款金额" width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.prePayFee}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="处理状态" width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.status|status}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="opp" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" class="btn" @click="receipt(scope.$index, scope.row)">付款</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :total="this.result.total"
      layout="prev, pager, next"
      @current-change="goPage"
      :current-page="currPage"
    ></el-pagination>
    <el-dialog title="销售单明细信息" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column prop="productCode" label="产品编号"></el-table-column>
        <el-table-column prop="productName" label="产品名称"></el-table-column>
        <el-table-column prop="unitName" label="产品数量单位"></el-table-column>
        <el-table-column prop="num" label="产品数量"></el-table-column>
        <el-table-column prop="unitPrice" label="销售单价"></el-table-column>
        <el-table-column prop="itemPrice" label="产品明细总价"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { requestGet } from "../../utils/http";
import { requestPost } from "../../utils/http";
export default {
  data() {
    return {
      activeName: "first",
      tableData: [],
      dialogTableVisible: false,
      gridData: [],
      currPage: 1,
      result: ""
    };
  },
  created() {
    requestGet("/api/main/purchase/pomain/show", { type: 3, payType: 1 }).then(
      resp => {
        this.result = resp.data;
        this.tableData = resp.data.list;
        console.log(this.tableData);
      }
    );
  },
  methods: {
    checkTab(tab) {
      if (tab.name == "first") {
        console.log(111);
        requestGet("/api/main/purchase/pomain/show", {
          type: 3,
          payType: 1
        }).then(resp => {
          this.result = resp.data;
          this.tableData = resp.data.list;
          console.log(this.tableData);
        });
      }
      if (tab.name == "second") {
        console.log(222);
        requestGet("/api/main/purchase/pomain/show", {
          type: 3,
          payType: 2
        }).then(resp => {
          this.result = resp.data;
          this.tableData = resp.data.list;
          console.log(this.tableData);
        });
      }
      if (tab.name == "third") {
        console.log(333);
        requestGet("/api/main/purchase/pomain/show", {
          type: 3,
          payType: 3
        }).then(resp => {
          this.result = resp.data;
          this.tableData = resp.data.list;
          console.log(this.tableData);
        });
      }
    },
    receipt(index, row) {
      console.log(row, 111);
      this.$confirm("该销售单是否继续付款登记?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (row.payType == 3 && row.status == 1) {
            requestPost("api/main/finance/pay", {
              poId: row.poId,
              type: 2
            }).then(resp => {
              let res = resp.data;
              console.log("修改响应", res);
              if (res.code === 2) {
                this.$message({
                  type: "success",
                  message: "付款登记成功!"
                });
                requestGet("/api/main/purchase/pomain/show", {
                  type: 3,
                  payType: 1
                }).then(resp => {
                  this.result = resp.data;
                  this.tableData = resp.data.list;
                  console.log(this.tableData);
                });
                this.currPage=1;
              } else {
                this.$message({
                  type: "info",
                  message: res.message
                });
              }
            });
          } else {
            requestPost("api/main/finance/pay", {
              poId: row.poId,
              type: 1
            }).then(resp => {
              let res = resp.data;
              console.log("修改响应", res);
              if (res.code === 2) {
                this.$message({
                  type: "success",
                  message: "付款登记成功!"
                });
                requestGet("/api/main/purchase/pomain/show", {
                  type: 3,
                  payType: 1
                }).then(resp => {
                  this.result = resp.data;
                  this.tableData = resp.data.list;
                  console.log(this.tableData);
                });
                this.currPage=1;
              } else {
                this.$message({
                  type: "info",
                  message: res.message
                });
              }
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消付款登记"
          });
        });
    },
    showPoitems(index, row) {
      console.log("index", index, "row", row);
      requestGet("/api/main/purchase/pomain/queryItem", {
        poId: row.poId
      }).then(resp => {
        this.gridData = resp.data;
        console.log(this.gridData);
      });
      this.dialogTableVisible = true;
    },
    goPage(page) {
      this.currPage = page;
      if (this.activeName == "first") {
        requestGet("/api/main/purchase/pomain/show", {
          type: 3,
          payType: 1,
          page: page
        }).then(resp => {
          this.result = resp.data;
          this.tableData = this.result.list;
        });
      }
      if (this.activeName == "second") {
        requestGet("/api/main/purchase/pomain/show", {
          type: 3,
          payType: 2,
          page: page
        }).then(resp => {
          this.result = resp.data;
          this.tableData = this.result.list;
        });
      }
      if (this.activeName == "third") {
        requestGet("/api/main/purchase/pomain/show", {
          type: 3,
          payType: 3,
          page: page
        }).then(resp => {
          this.result = resp.data;
          this.tableData = this.result.list;
        });
      }
    }
  },
  filters: {
    paytype(value) {
      if (value == 1) {
        return "货到付款";
      }
      if (value == 2) {
        return "款到发货";
      }
      if (value == 3) {
        return "预付款到发货";
      }
    },
    status(value) {
      if (value == 1) {
        return "新增";
      }
      if (value == 2) {
        return "已收货";
      }
      if (value == 3) {
        return "已付款";
      }
      if (value == 4) {
        return "已了结";
      }
      if (value == 5) {
        return "已预付";
      }
    }
  }
};
</script>