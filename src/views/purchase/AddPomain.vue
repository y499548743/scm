<template>
  <div>
    <p>
      <el-button @click="addPoitems">
        <i class="el-icon-circle-plus"></i>增加明细
      </el-button>
      <el-button @click="savePomain">
        <i class="el-icon-s-order"></i>保存
      </el-button>
    </p>
    <table class="pomainTab">
      <tr>
        <td>采购单编号</td>
        <td>
          <el-input v-model="pomainTab.poId" :disabled="true"></el-input>
        </td>
        <td>创建时间</td>
        <td>
          <el-input v-model="pomainTab.createTime" :disabled="true"></el-input>
        </td>
        <td>供应商</td>
        <td>
          <el-input v-model="pomainTab.supplier" class="supplierIpt"></el-input>
          <span class="el-icon-edit-outline" @click="dialogFormVisible=true"></span>
        </td>
      </tr>
      <tr>
        <td>创建用户</td>
        <td>
          <el-input v-model="account" :disabled="true"></el-input>
        </td>
        <td>附加费用</td>
        <td>
          <el-input v-model="pomainTab.tipFee" @input="getpoTotal"></el-input>
        </td>
        <td>采购总价</td>
        <td>
          <el-input v-model="pomainTab.poTotal" :disabled="true"></el-input>
        </td>
      </tr>
      <tr>
        <td>付款方式</td>
        <td>
          <el-select v-model="pomainTab.payType" placeholder="请选择付款方式" @change="paySelect">
            <el-option value="1" label="货到付款"></el-option>
            <el-option value="2" label="款到发货"></el-option>
            <el-option value="3" label="预付款到发货"></el-option>
          </el-select>
        </td>
        <td>最低预付款金额</td>
        <td>
          <el-input v-model="pomainTab.prePayFee" :disabled="disabled"></el-input>
        </td>
        <td>备注</td>
        <td>
          <el-input></el-input>
        </td>
      </tr>
    </table>
    <el-table :data="tableData" style="width: 1100px">
      <el-table-column prop="ordinal" label="序号" width="50px">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="productCode" label="产品编号" width="160px">
        <template slot-scope="scope">
          <span>
            <el-input v-model="scope.row.productCode" :disabled="true"></el-input>
          </span>
          <span class="el-icon-edit-outline" @click="showProductDialog(scope.$index,scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="产品名称">
        <template slot-scope="scope">
          <span>
            <el-input v-model="scope.row.name" :disabled="true"></el-input>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="unitName" label="数量单位">
        <template slot-scope="scope">
          <span>
            <el-input v-model="scope.row.unitName" :disabled="true"></el-input>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="num" label="产品数量">
        <template slot-scope="scope">
          <span>
            <el-input v-model.number="scope.row.num" @input="getItemPrice(scope.$index,scope.row)"></el-input>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="unitPrice" label="产品单价">
        <template slot-scope="scope">
          <span>
            <el-input
              v-model.number="scope.row.unitPrice"
              @input="getItemPrice(scope.$index,scope.row)"
            ></el-input>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="itemPrice" label="明细总价">
        <template slot-scope="scope">
          <span>
            <el-input v-model="scope.row.itemPrice"></el-input>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="opp" label="操作" width="120px">
        <template slot-scope="scope">
          <el-button type="danger" class="btn" @click="deletePoitem(scope.$index,tableData)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="供应商选择" :visible.sync="dialogFormVisible">
      <el-table :data="venderData">
        <el-table-column label="选择">
          <template slot-scope="scope">
            <span>
              <el-radio
                v-model="venderRadio"
                :label="scope.$index"
                @change="venderChecked(scope.$index, scope.row)"
              >ㅤㅤㅤ</el-radio>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="vendertCode" label="供应商编码">
          <template slot-scope="scope">
            <span>{{scope.row.venderCode}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="供应商名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="supplierConfirm">确 认</el-button>
      </div>
    </el-dialog>
    <el-dialog title="产品选择" :visible.sync="dialogProductVisible">
      <el-table :data="gridData">
        <el-table-column label="选择" width="150">
          <template slot-scope="scope">
            <span>
              <el-radio
                v-model="radio"
                :label="scope.$index"
                @change="productChecked(scope.$index, scope.row)"
              >ㅤㅤㅤ</el-radio>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="productCode" label="产品编码" width="150">
          <template slot-scope="scope">
            <span>{{scope.row.productCode}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="产品名称" width="200">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unitName" label="数量单位">
          <template slot-scope="scope">
            <span>{{scope.row.unitName}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="noChange">取 消</el-button>
        <el-button type="primary" @click="productConfirm">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { requestGet } from "../../utils/http";
import { requestPost } from "../../utils/http";
import { requestPostJson } from "../../utils/http";
export default {
  data() {
    return {
      pomainTab: {
        poId: parseInt(
          new Date(+new Date() + 8 * 3600 * 1000)
            .toISOString()
            .split(/-|T|:|Z/)
            .join("")
        ),
        createTime: new Date(+new Date() + 8 * 3600 * 1000)
          .toISOString()
          .replace("T", " ")
          .substr(0, 19),
        supplier: "",
        tipFee: 0,
        productTotal: "",
        prePayFee: 0,
        payType: "",
        status: 1,
        poTotal: ""
      },
      dialogFormVisible: false,
      dialogProductVisible: false,
      result: "",
      // form: {
      //   name: "",
      //   venderCode: ""
      // },
      venderData:[],
      tableData: [],
      gridData: [],
      radio: false,
      venderRadio:false,
      disabled:true
    };
  },
  created() {
    requestGet("/api/main/purchase/vender/all").then(resp => {
      this.venderData = resp.data;
      console.log(this.venderData, "111");
    }),
      requestGet("/api/main/sell/product/all").then(resp => {
        this.gridData = resp.data;
        console.log(this.gridData, "222");
      });
  },
  computed: {
    ...mapState(["user"]),

    account: {
      get() {
        return this.$store.state.user.account;
      },
      set(value) {
        this.$store.commit("updateAccount", value);
      }
    }
  },
  mutations: {
    updateAccount(state, account) {
      state.user.account = account;
    }
  },
  methods: {
    // selectName() {
    //   let i = 0;
    //   for (i = 0; i < this.result.length; i++) {
    //     if (this.result[i].name == this.form.name) {
    //       break;
    //     }
    //   }
    //   this.form.venderCode = this.result[i].venderCode;
    // },
    venderChecked(index,row){
      sessionStorage.setItem("venderMsg", JSON.stringify(row));
    },
    supplierConfirm() {
      let venderMsg=JSON.parse(sessionStorage.getItem("venderMsg"))
      this.pomainTab.supplier = venderMsg.name;
      this.dialogFormVisible = false;
    },
    showProductDialog(index, row) {
      this.dialogProductVisible = true;
      console.log("index", index, "row", row);
      this.tableData[index].productCode = "";
      this.tableData[index].name = "";
      this.tableData[index].unitName = "";
      sessionStorage.setItem("i", index);
    },
    productChecked(index, row) {
      console.log("index", index, "row", row);
      sessionStorage.setItem("productMsg", JSON.stringify(row));
    },
    productConfirm() {
      let productMsg = JSON.parse(sessionStorage.getItem("productMsg"));
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].productCode == "") {
          this.tableData[i].productCode = productMsg.productCode;
          this.tableData[i].name = productMsg.name;
          this.tableData[i].unitName = productMsg.unitName;
          break;
        }
        if (this.tableData[i].productCode == productMsg.productCode) {
          this.$alert("不可重复添加同一产品", "警告", {
            type: "warning",
            center: true
          });
          break;
        }
      }
      this.dialogProductVisible = false;
    },
    noChange() {
      this.dialogProductVisible = false;
      let productMsg = JSON.parse(sessionStorage.getItem("productMsg"));
      let i = sessionStorage.getItem("i");
      this.tableData[i].productCode = productMsg.productCode;
      this.tableData[i].name = productMsg.name;
      this.tableData[i].unitName = productMsg.unitName;
    },
    addPoitems() {
      this.tableData.push({
        productCode: "",
        name: "",
        unitName: "",
        num: "",
        unitPrice: ""
      });
    },
    deletePoitem(index, rows) {
      rows.splice(index, 1);
      this.pomainTab.tipFee = parseFloat(this.pomainTab.tipFee);
      let sum = 0;
      for (let i = 0; i < this.tableData.length; i++) {
        sum += this.tableData[i].itemPrice;
      }
      this.pomainTab.poTotal = this.pomainTab.tipFee + sum;
    },
    getItemPrice(index, row) {
      console.log("index", index, "row", row);
      console.log(this.tableData, "333");
      if (row.num > 0 && row.unitPrice > 0) {
        row.itemPrice = row.num * row.unitPrice;
        this.pomainTab.productTotal = 0;
        for (let i = 0; i < this.tableData.length; i++) {
          this.pomainTab.productTotal += this.tableData[i].itemPrice;
        }
      } else {
        row.itemPrice = "";
      }
      this.pomainTab.poTotal =
        this.pomainTab.tipFee + this.pomainTab.productTotal;
    },
    savePomain() {
      let venderMsg=JSON.parse(sessionStorage.getItem("venderMsg"))
      this.pomainTab["account"] = this.account;
      this.pomainTab["poitems"] = this.tableData;
      this.pomainTab["venderCode"] = venderMsg.venderCode;
      this.pomainTab.poTotal =
        this.pomainTab.tipFee + this.pomainTab.productTotal;
      // this.pomainTab.payType=Number(this.pomainTab.payType)
      delete this.pomainTab.supplier;
      console.log(this.pomainTab);
      console.log(JSON.stringify(this.pomainTab));
      requestPostJson("/api/main/purchase/pomain/add", this.pomainTab).then(
        resp => {
          let res = resp.data;
          console.log("响应", res);
          if (res.code == 2) {
            this.$router.push("/purchase/pomainmanager");
          }
        }
      );
    },
    getpoTotal() {
      console.log(11);
      this.pomainTab.tipFee = parseFloat(this.pomainTab.tipFee);
      let sum = 0;
      for (let i = 0; i < this.tableData.length; i++) {
        sum += this.tableData[i].itemPrice;
      }
      this.pomainTab.poTotal = this.pomainTab.tipFee + sum;
    },
     paySelect(){
      if(this.pomainTab.payType=="3"){
        this.disabled=false;
      }else{
        this.disabled=true
      }
    }
    // supplierCheck() {
    //   if (this.pomainTab.supplier == "") {
    //     this.err1 = "不能为空";
    //   } else {
    //     this.err1 = "";
    //   }
    // },
    // tipFeeCheck() {
    //   if (this.pomainTab.tipFee < 0) {
    //     this.err2 = "不能为负数";
    //   } else {
    //     this.err2 = "";
    //   }
    // },
    // payTypeCheck() {
    //   if (this.pomainTab.payType == "") {
    //     this.err3= "不能为空";
    //   } else {
    //     this.err3= "";
    //   }
    // },
    // prePayFeeCheck() {
    //   if (this.pomainTab.prePayFee < 0) {
    //     this.err4= "不能为负数";
    //   } else {
    //     this.err4 = "";
    //   }
    // }
  }
};
</script>
<style scoped>
.pomainTab {
  width: 1100px;
  font-size: 12px;
  border: 1px solid #ccc;
  border-collapse: collapse;
  margin-top: 10px;
}
.pomainTab td {
  border-right: dotted 1px #c7c7c7;
  height: 50px;
  text-indent: 10px;
}
.pomainTab tr:nth-child(2) {
  background-color: #f5f8fa;
}
.pomainTab .el-input {
  width: 200px;
}
.pomainTab .el-select {
  width: 200px;
}
.vcipt {
  width: 217px;
}
.supplierIpt {
  font-size: 12px;
}
.btn {
  padding: 2px 3px;
}
.el-table .el-input {
  width: 120px;
}
.err {
  color: red;
}
</style>