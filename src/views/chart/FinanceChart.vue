<template>
  <div>
    <el-date-picker
      v-model="dateValue"
      type="month"
      placeholder="选择月"
      format="yyyy 年 MM 月"
      value-format="yyyy-MM"
    ></el-date-picker>
    <el-button type="primary" @click="onSubmit">查询</el-button>
    <h3>主信息</h3>
    <el-table :data="mainData" stripe style="100%">
      <el-table-column prop="recePrice" label="收款总金额">
        <template slot-scope="scope">
          <span>{{scope.row.recePrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="payPrice" label="付款总金额">
        <template slot-scope="scope">
          <span>{{scope.row.payPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="receCount" label="收款交易次数">
        <template slot-scope="scope">
          <span>{{scope.row.receCount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="payCount" label="付款交易次数">
        <template slot-scope="scope">
          <span>{{scope.row.payCount}}</span>
        </template>
      </el-table-column>
    </el-table>
    <h3>明细信息</h3>
    <el-tabs v-model="activeName" type="card" @tab-click="checkTab">
      <el-tab-pane label="收款明细" name="first">
        <el-table :data="receiptData" stripe style="100%">
          <el-table-column prop="ordinal" label="序号" width="100px">
            <template slot-scope="scope">
              <span>{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="soId" label="销售单号">
            <template slot-scope="scope">
              <span>{{scope.row.soId}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="销售单日期">
            <template slot-scope="scope">
              <span>{{scope.row.createTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pay_time" label="收款日期">
            <template slot-scope="scope">
              <span>{{scope.row.pay_time}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pay_price" label="收款金额">
            <template slot-scope="scope">
              <span>{{scope.row.pay_price}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="account" label="经手人">
            <template slot-scope="scope">
              <span>{{scope.row.account}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="处理状态">
            <template slot-scope="scope">
              <span>{{scope.row.status|status}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="付款明细" name="second">
        <el-table :data="payData" stripe style="100%">
          <el-table-column prop="ordinal" label="序号" width="100px">
            <template slot-scope="scope">
              <span>{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="poId" label="采购单号">
            <template slot-scope="scope">
              <span>{{scope.row.poId}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="采购日期">
            <template slot-scope="scope">
              <span>{{scope.row.createTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pay_time" label="付款日期">
            <template slot-scope="scope">
              <span>{{scope.row.pay_time}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pay_price" label="付款金额">
            <template slot-scope="scope">
              <span>{{scope.row.pay_price}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="account" label="经手人">
            <template slot-scope="scope">
              <span>{{scope.row.account}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="处理状态">
            <template slot-scope="scope">
              <span>{{scope.row.status|status}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-pagination
      background
      :total="this.result.total"
      layout="prev, pager, next"
      @current-change="goPage"
      :current-page="currPage"
    ></el-pagination>
  </div>
</template>
<script>
import { requestGet } from "../../utils/http";
export default {
  data() {
    return {
      dateValue: "",
      mainData: [],
      payData: [],
      receiptData: [],
      activeName: "first",
      currPage: 1,
      result: ""
    };
  },
  methods: {
    onSubmit() {
      let date = this.dateValue;
      console.log(date);
      requestGet("/api/main/report/payment/main", { time: date }).then(resp => {
        this.mainData.length = 0;
        this.mainData.push(resp.data);
      });
      if (this.activeName == "first") {
        requestGet("/api/main/report/payment/detail/receipt", {
          time: date
        }).then(resp => {
          this.result = resp.data;
          console.log(this.result, 11);
          this.receiptData = resp.data.list;
          console.log(this.receiptData, 111);
        });
      }
      if (this.activeName == "second") {
        requestGet("/api/main/report/payment/detail/pay", { time: date }).then(
          resp => {
            this.result = resp.data;
            console.log(this.result, 22);
            this.payData = resp.data.list;
            console.log(this.payData, 222);
          }
        );
      }
    },
    checkTab(tab) {
      let date = this.dateValue;
      if (tab.name == "first") {
        requestGet("/api/main/report/payment/detail/receipt", {
          time: date
        }).then(resp => {
          this.result = resp.data;
          this.receiptData = resp.data.list;
        });
      }
      if (tab.name == "second") {
        console.log(222);
        requestGet("/api/main/report/payment/detail/pay", {
          time: date
        }).then(resp => {
          this.result = resp.data;
          this.payData = resp.data.list;
        });
      }
    },
    goPage(page) {
      let date = this.dateValue;
      this.currPage = page;
      if (this.activeName == "first") {
        requestGet("/api/main/report/payment/detail/receipt", {
          time: date,
          page: page
        }).then(resp => {
          this.result = resp.data;
          this.receiptData = resp.data.list;
        });
      }
      if (this.activeName == "second") {
        requestGet("/api/main/report/payment/detail/pay", {
          time: date,
          page: page
        }).then(resp => {
          this.result = resp.data;
          this.payData = resp.data.list;
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
<style scoped>
.vcipt {
  width: 217px;
}
h3 {
  text-align: center;
  margin: 10px 0 10px 0;
}
</style>