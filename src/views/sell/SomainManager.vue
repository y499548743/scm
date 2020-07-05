<template>
  <div class="contain">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="销售单编号">
        <el-input v-model="formInline.soId"></el-input>
      </el-form-item>
      <el-form-item label="日期范围">
        <el-date-picker
          v-model="formInline.dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="起始日期"
          end-placeholder="截止日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="客户选择">
        <el-input v-model="formInline.customer" @focus="dialogFormVisible=true"></el-input>
      </el-form-item>
      <el-form-item label="付款方式">
        <el-select v-model="formInline.payType">
          <el-option label="货到付款" value="1"></el-option>
          <el-option label="款到发货" value="2"></el-option>
          <el-option label="预付款到发货" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">过滤</el-button>
      </el-form-item>
      <el-form-item>
        <router-link to="/sell/addsomain">
          <el-button>
            <i class="el-icon-circle-plus"></i>添加
          </el-button>
        </router-link>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" stripe style="100%">
      <el-table-column prop="ordinal" label="序号" width="50px">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="soId" label="销售单编号" width="140px">
        <template slot-scope="scope">
          <span @click="showSoitems(scope.$index, scope.row)">{{scope.row.soId}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="customerName" label="客户名称" width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.customerName}}</span>
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
      <el-table-column prop="productTotal" label="产品总价" width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.productTotal}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="soTotal" label="销售单总价格" width="70px">
        <template slot-scope="scope">
          <span>{{scope.row.soTotal}}</span>
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
      <el-table-column prop="opp" label="操作">
        <template slot-scope="scope">
          <router-link to="/sell/changesomain">
            <el-button type="primary" class="btn" @click="getsoId(scope.$index,scope.row)">修改</el-button>
          </router-link>
          <el-button type="danger" class="btn" @click="deleteSomain(scope.$index, scope.row)">删除</el-button>
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
    <el-dialog title="客户选择" :visible.sync="dialogFormVisible">
      <el-table :data="customerMsg">
        <el-table-column label="选择">
          <template slot-scope="scope">
            <span>
              <el-radio
                v-model="customerRadio"
                :label="scope.$index"
                @change="customerChecked(scope.$index, scope.row)"
              >ㅤㅤㅤ</el-radio>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="customertCode" label="客户编码">
          <template slot-scope="scope">
            <span>{{scope.row.customerCode}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="客户名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="customerConfirm">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { requestGet } from "../../utils/http";
import { requestPost } from "../../utils/http";
export default {
  data() {
    return {
      tableData: [],
      currPage: 1,
      result: "",
      formInline: {
        soId: "",
        dateValue: "",
        customer: ""
      },
      customerMsg: [],
      dialogFormVisible: false,
      gridData: [],
      dialogTableVisible: false,
      customerRadio:false
    };
  },
  created() {
    requestGet("/api/main/sell/somain/show", { type: 1 }).then(resp => {
      this.result = resp.data;
      this.tableData = resp.data.list;
      console.log(this.tableData, "1111");
    });
    requestGet("/api/main/sell/customer/show").then(resp => {
      this.customerMsg = resp.data.list;
      console.log(this.customerMsg, "111");
    });
  },
  methods: {
    getsoId(index, row) {
      console.log("index", index, "row", row);
      sessionStorage.setItem("soId", row.soId);
      sessionStorage.setItem("soIndex", index);
    },
    deleteSomain(index, row) {
      console.log(row.soId);
      this.$confirm("此操作将永久删除该销售单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          requestPost("/api/main/sell/somain/delete", {
            soId: row.soId
          }).then(resp => {
            let res = resp.data;

            console.log("修改响应", res);
            if (res.code === 2) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              requestGet("/api/main/sell/somain/show", { type: 1 }).then(
                resp => {
                  this.result = resp.data;
                  this.tableData = resp.data.list;
                  console.log(this.tableData, "1111");
                }
              );
              this.currPage=1;
            } else {
              this.$message({
                type: "info",
                message: res.message
              });
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
    goPage(page) {
      this.currPage = page;
      this.formInline["page"] = this.currPage;
      requestGet("/api/main/sell/somain/query", this.formInline).then(resp => {
        this.result = resp.data;
        this.tableData = this.result.list;
      });
    },
    customerChecked(index, row) {
      sessionStorage.setItem("customer", JSON.stringify(row));
    },
    customerConfirm() {
      let customer = JSON.parse(sessionStorage.getItem("customer"));
      this.formInline.customer = customer.name;
      this.dialogFormVisible = false;
    },
    onSubmit() {
      let customer = JSON.parse(sessionStorage.getItem("customer"));
      let startDate = this.formInline.dateValue[0];
      let endDate = this.formInline.dateValue[1];
      this.formInline["startDate"] = startDate;
      this.formInline["endDate"] = endDate;
      this.formInline["customerCode"] = customer.customerCode;
      console.log(this.formInline);
      requestGet("/api/main/sell/somain/query", this.formInline).then(resp => {
        this.result = resp.data;
        this.tableData = resp.data.list;
        console.log(this.tableData);
      });
    },
    showSoitems(index, row) {
      console.log("index", index, "row", row);
      requestGet("/api/main/sell/somain/queryItem", {
        soId: row.soId
      }).then(resp => {
        this.gridData = resp.data;
        console.log(this.gridData);
      });
      this.dialogTableVisible = true;
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
    }
  }
};
</script>
<style scoped>
/* .contain {
  width: 1000px;
  margin: auto;
} */
p {
  padding: 10px 0 10px 0;
}
.btn {
  padding: 2px 3px;
}
.vcipt {
  width: 217px;
}
</style>