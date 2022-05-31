<template>
  <div class="layout-px-spacing">
    <portal to="breadcrumb">
      <ul class="navbar-nav flex-row">
        <li>
          <div class="page-header">
            <nav class="breadcrumb-one" aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <a href="javascript:;">Middle Office</a>
                </li>
                <li class="breadcrumb-item active" aria-current="page">
                  <span>My Positions</span>
                </li>
              </ol>
            </nav>
          </div>
        </li>
      </ul>
    </portal>

    <div class="row layout-top-spacing">
      <div id="tabsSimple" class="col-lg-12 col-12 layout-spacing">
        <div class="statbox panel box box-shadow">
          <div class="panel-heading">
            <div class="row">
              <div class="col-xl-12 col-md-12 col-sm-12 col-12">
                <h4>My Positions</h4>
              </div>
            </div>
          </div>
          <div id="tableProgress" class="col-lg-8 col-12 layout-spacing">
            <div class="statbox panel box box-shadow">
              <div class="panel-body">
                <b-table
                  responsive
                  bordered
                  :items="getPortfolioPositionsTotal"
                  :fields="['summary', 'value', 'dailySummary', 'dailyValue']"
                >
                  <template #cell(name)="row">
                    {{ row.item["first name"] + " " + row.item["last name"] }}
                  </template>
                  <template #cell(progress)="row">
                    <b-progress
                      v-if="row.index == 0"
                      variant="primary"
                      :value="row.item.sales"
                      :min="0"
                      :max="100"
                      class="br-30"
                    ></b-progress>
                    <b-progress
                      v-if="row.index == 1"
                      variant="warning"
                      :value="row.item.sales"
                      :min="0"
                      :max="100"
                      class="br-30"
                    ></b-progress>
                    <b-progress
                      v-if="row.index == 2"
                      variant="success"
                      :value="row.item.sales"
                      :min="0"
                      :max="100"
                      class="br-30"
                    ></b-progress>
                    <b-progress
                      v-if="row.index == 3"
                      variant="secondary"
                      :value="row.item.sales"
                      :min="0"
                      :max="100"
                      class="br-30"
                    ></b-progress>
                  </template>
                  <template #cell(sales)="row">
                    <p :class="row.index == 3 ? 'text-success' : 'text-danger'">
                      {{ row.value + "%" }}
                    </p>
                  </template>
                </b-table>
                <div class="d-flex content-justify-end">
                  <span class="mt-2">Base Currency :</span>&nbsp;&nbsp;
                  <span class="ml-2">
                    <b-dropdown
                      variant="outline-primary"
                      class="mb-4 mr-2 custom-dropdown"
                    >
                      <template #button-content>
                        USDT
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="feather feather-chevron-down"
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </template>
                      <b-dropdown-item>USDT</b-dropdown-item>
                    </b-dropdown>
                    &nbsp;
                    <label for="file" class="btn btn-info mb-4"
                      >Import Targeted Weights</label
                    >
                  </span>
                  <input
                    id="file"
                    type="file"
                    style="display: none"
                    @change="uploadPositionFile"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="panel-body simple-tab">
            <b-tabs nav-class="mb-0 mt-0">
              <b-tab title="Positions" active>
                <div class="row">
                  <div class="col-12 layout-spacing">
                    <div class="panel br-6">
                      <div class="custom-table panel-body p-0">
                        <div
                          class="
                            flex-wrap
                            justify-content-center justify-content-sm-start
                            px-3
                            pt-3
                            pb-0
                            text-right
                          "
                        >
                          <b-button
                            variant="primary"
                            class="m-1"
                            @click="export_table('csv')"
                            >CSV</b-button
                          >
                          <json-excel
                            class="btn btn-primary m-1"
                            name="table.xls"
                            :fields="excel_columns()"
                            :data="excel_items()"
                            >Excel</json-excel
                          >
                          <b-button
                            variant="primary"
                            class="m-1"
                            @click="export_table('print')"
                            >Print</b-button
                          >
                          <b-button
                            variant="primary"
                            class="m-1"
                            @click="export_table('pdf')"
                            >PDF</b-button
                          >
                        </div>
                        <div class="table-header">
                          <div class="d-flex align-items-center">
                            <span>Results :</span>
                            <span class="ml-2">
                              <b-select
                                v-model="table_option.page_size"
                                size="sm"
                              >
                                <b-select-option value="5">5</b-select-option>
                                <b-select-option value="10">10</b-select-option>
                                <b-select-option value="20">20</b-select-option>
                                <b-select-option value="50">50</b-select-option>
                              </b-select>
                            </span>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <span>Last Updated :</span>
                            <span class="ml-2">
                              <timeago
                                :datetime="markPriceUpdateTime"
                                :auto-update="60"
                              ></timeago>
                            </span>
                          </div>
                          <div class="header-search">
                            <b-input
                              v-model="table_option.search_text"
                              size="sm"
                              placeholder="Search..."
                            />
                            <div class="search-image">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="feather feather-search"
                              >
                                <circle cx="11" cy="11" r="8"></circle>
                                <line
                                  x1="21"
                                  y1="21"
                                  x2="16.65"
                                  y2="16.65"
                                ></line>
                              </svg>
                            </div>
                          </div>
                        </div>

                        <b-table
                          ref="basic_table"
                          responsive
                          hover
                          :items="getPortfolioPositionsTable"
                          :fields="columns"
                          :per-page="table_option.page_size"
                          :current-page="table_option.current_page"
                          :filter="table_option.search_text"
                          sort-by="name"
                          :show-empty="true"
                          @filtered="on_filtered"
                        >
                          <template #cell(icon)="row">
                            <cryptoicon
                              v-if="row.item.position === 'LUNA'"
                              :symbol="'generic'"
                              size="16"
                            />
                            <cryptoicon
                              v-else-if="row.item.position === 'QNT'"
                              :symbol="'generic'"
                              size="16"
                            />
                            <cryptoicon
                              v-else-if="row.item.position === 'HNT'"
                              :symbol="'generic'"
                              size="16"
                            />
                            <cryptoicon
                              v-else-if="row.item.position === 'AVAX'"
                              :symbol="'generic'"
                              size="16"
                            />
                            <cryptoicon
                              v-else-if="row.item.position === 'AXS'"
                              :symbol="'generic'"
                              size="16"
                            />
                            <cryptoicon
                              v-else
                              :symbol="row.item.position"
                              size="16"
                            />
                          </template>
                          <template #cell(position)="row"
                            >{{ row.item.position }}
                          </template>
                          <template #cell(mark-price)="row">
                            <span
                              tag="a"
                              v-b-popover.top.hover="row.item['mark-time']"
                              variant="primary"
                              >{{
                                Number(row.item["mark-price"]).toFixed(2)
                              }}</span
                            >
                          </template>
                          <template #cell(total-qty)="row">
                            <span
                              tag="a"
                              v-b-popover.top.hover="row.item['qty-time']"
                              variant="primary"
                              >{{
                                Number(row.item["total-qty"]).toFixed(2)
                              }}</span
                            >
                          </template>
                          <template #cell(total-amount)="row">
                            {{ Number(row.item["total-amount"]).toFixed(2) }}
                          </template>
                          <template #cell(avg-bought-price)="row">
                            {{
                              Number(row.item["avg-bought-price"]).toFixed(2)
                            }}
                          </template>
                          <template #cell(avg-sold-price)="row">
                            {{ Number(row.item["avg-sold-price"]).toFixed(2) }}
                          </template>
                          <template #cell(incoming-pnl)="row">
                            {{ Number(row.item["incoming-pnl"]).toFixed(2) }}
                          </template>
                          <template #cell(close1)="row">
                            <span
                              tag="a"
                              v-b-popover.top.hover="row.item['close1-time']"
                              variant="primary"
                              >{{ Number(row.item["close1"]).toFixed(2) }}</span
                            >
                          </template>
                          <template #cell(thumb)="row">
                            <img
                              :src="
                                require('@/assets/images/' + row.item.thumb)
                              "
                              class="rounded-circle profile-img"
                              alt="avatar"
                            />
                          </template>
                          <template #cell(pnl-contribution)="row"
                            >{{
                              (100 * row.item["pnl-contribution"]).toFixed(2)
                            }}%
                          </template>
                          <template #cell(current-weight)="row"
                            >{{
                              (100 * row.item["current-weight"]).toFixed(2)
                            }}%
                          </template>
                          <template #cell(target-weight)="row"
                            >{{ (100 * row.item["target-weight"]).toFixed(2) }}%
                          </template>
                          <template #cell(salary)="row">
                            ${{ row.item.salary }}
                          </template>
                          <template #cell(action)>
                            <b-button-group>
                              <b-button variant="dark">Open</b-button>
                              <b-button-group>
                                <b-dropdown
                                  variant="dark"
                                  :right="true"
                                  toggle-tag="a"
                                  class="custom-dropdown"
                                >
                                  <template #button-content>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      class="feather feather-chevron-down"
                                    >
                                      <polyline
                                        points="6 9 12 15 18 9"
                                      ></polyline>
                                    </svg>
                                  </template>
                                  <b-dropdown-item>Action</b-dropdown-item>
                                  <b-dropdown-item
                                    >Another action</b-dropdown-item
                                  >
                                  <b-dropdown-item
                                    >Something else here...</b-dropdown-item
                                  >
                                  <b-dropdown-divider></b-dropdown-divider>
                                  <b-dropdown-item
                                    >Separated link</b-dropdown-item
                                  >
                                </b-dropdown>
                              </b-button-group>
                            </b-button-group>
                          </template>
                        </b-table>

                        <div class="table-footer">
                          <div class="dataTables_info">
                            Showing
                            {{ meta.total_items ? meta.start_index + 1 : 0 }} to
                            {{ meta.end_index + 1 }} of {{ meta.total_items }}
                          </div>
                          <div
                            class="
                              paginating-container
                              pagination-solid
                              flex-column
                              align-items-right
                            "
                          >
                            <b-pagination
                              v-model="table_option.current_page"
                              :total-rows="table_option.total_rows"
                              :per-page="table_option.page_size"
                              prev-text="Prev"
                              next-text="Next"
                              first-text="First"
                              last-text="Last"
                              first-class="first"
                              prev-class="prev"
                              next-class="next"
                              last-class="last"
                              class="rounded"
                            >
                              <template #first-text>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                                  />
                                </svg>
                              </template>
                              <template #prev-text>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15 19l-7-7 7-7"
                                  />
                                </svg>
                              </template>
                              <template #next-text>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </template>
                              <template #last-text>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                                  />
                                </svg>
                              </template>
                            </b-pagination>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </b-tab>
              <!-- <b-tab title="Charts">
                <div class="media">
                  <img
                    class="mr-3"
                    src="@/assets/images/profile-32.jpeg"
                    alt="Generic placeholder image"
                  />
                  <div class="media-body">
                    <h5 class="mt-0 mb-3">Media heading</h5>
                    Cras sit amet nibh libero, in gravida nulla. Nulla vel metus
                    scelerisque ante sollicitudin. Cras purus odio, vestibulum
                    in vulputate at, tempus viverra turpis. Fusce condimentum
                    nunc ac nisi vulputate fringilla. Donec lacinia congue felis
                    in faucibus.
                  </div>
                </div>
              </b-tab> -->
            </b-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//excel export
import "@/assets/sass/scrollspyNav.scss";
import "@/assets/sass/components/tabs-accordian/custom-tabs.scss";
import JsonExcel from "vue-json-excel";

//pdf export
import jsPDF from "jspdf";
import "jspdf-autotable";

import { mapGetters, mapActions } from "vuex";
import {
  FETCH_ASSETS_DATA,
  FETCH_OHLC_DATA,
  FETCH_MARKET_DATA,
  UPDATE_INTERNAL_PNL,
  FETCH_PORTFOLIO_POSITIONS_TABLE,
  GET_PORTFOLIO_POSITIONS_TABLE,
  FETCH_PORTFOLIO_POSITIONS_TOTAL,
  GET_PORTFOLIO_POSITIONS_TOTAL,
  SET_PORTFOLIO_POSITIONS_TARGET_WEIGHTS,
  UPDATE_PORTFOLIO_POSITIONS_TABLE,
} from "@/store/portfolios.module";

export default {
  metaInfo: { title: "My Positions" },
  components: { JsonExcel },
  computed: {
    ...mapGetters([
      GET_PORTFOLIO_POSITIONS_TABLE,
      GET_PORTFOLIO_POSITIONS_TOTAL,
    ]),
    ...mapActions([
      FETCH_ASSETS_DATA,
      FETCH_OHLC_DATA,
      FETCH_MARKET_DATA,
      UPDATE_INTERNAL_PNL,     
      UPDATE_PORTFOLIO_POSITIONS_TABLE,
      FETCH_PORTFOLIO_POSITIONS_TABLE,
      FETCH_PORTFOLIO_POSITIONS_TOTAL,
    ]),
  },
  data() {
    return {
      importPositions: {
        status: "",
        file: null,
      },
      portfolioId: "628c4600d56cffb15033c6e1",
      markPriceUpdateTime: 0,
      items: [],
      columns: [],
      table_option: {
        total_rows: 0,
        current_page: 1,
        page_size: 50,
        search_text: "",
      },
      meta: {},
    };
  },
  watch: {
    table_option: {
      handler: function () {
        this.get_meta();
      },
      deep: true,
    },
  },
  mounted() {
    this.bind_data();
    this.updatePositionsTable().then(() => {
      setInterval(this.updatePositionsTable, 180000);
    });
  },
  methods: {
    updatePositionsTable() {
      return new Promise((resolve) => {
        this.$store
          .dispatch(FETCH_PORTFOLIO_POSITIONS_TOTAL, {
            portfolioId: this.portfolioId,
          })
          .then(() => {
            this.$store
              .dispatch(FETCH_PORTFOLIO_POSITIONS_TABLE, {
                portfolioId: this.portfolioId,
              })
              .then((table) => {
                this.updatePnL();
                this.table_option.total_rows = table.length;
                this.markPriceUpdateTime = new Date();
                this.fetchAssets().then(() => {
                  this.fetchPriceRecurr(table, []).then(() => {
                    this.fetchOHLCRecurr(table, []).then(() => {
                      this.updatePnL();
                      this.$store
                        .dispatch(UPDATE_PORTFOLIO_POSITIONS_TABLE)
                        .then(() => {
                          resolve();
                        });
                    });
                  });
                });
              });
          });
      });
    },
    uploadPositionFile(element) {
      this.importPositions.file = element.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const input = e.target.result;
        console.log("input::", input);
        const lines = input.split("\n");
        const header = lines[0].replace(/\s/g, "").split(",");
        const output = lines.slice(1).map((line) => {
          const fields = line.replace(/(\r\n|\n|\r|\s)/gm, "").split(",");
          return Object.fromEntries(header.map((h, i) => [h, fields[i]]));
        });
        this.importPositions.settings = output.filter((e) => e.Position !== "");
        this.importPositions.status = "uploaded";
        console.log(this.importPositions);
        this.$store.commit(
          SET_PORTFOLIO_POSITIONS_TARGET_WEIGHTS,
          this.importPositions.settings
        );
        this.$store.dispatch(UPDATE_PORTFOLIO_POSITIONS_TABLE).then(() => {});
      };
      reader.readAsText(this.importPositions.file);
    },
    fetchPriceRecurr(tableInputs, results) {
      return new Promise((resolve) => {
        console.log("[ fetchPriceRecurr ] table.length", tableInputs.length);
        if (tableInputs.length > 0) {
          let table = tableInputs;
          if (tableInputs[0].position === "USDT") {
            table = tableInputs.slice(1);
          }
          console.log(
            "[ fetchPriceRecurr ] market",
            `${table[0].position}USDT`
          );
          this.$store
            .dispatch(FETCH_MARKET_DATA, {
              position: { market: `${table[0].position}USDT` },
              portfolioId: this.portfolioId,
            })
            .then((result) => {
              console.log(`${table[0].position}USDT---->`, result);
              resolve(
                this.fetchPriceRecurr(table.slice(1), [result, ...results])
              );
            })
            .catch(() =>
              resolve(this.fetchPriceRecurr(table.slice(1), results))
            );
        } else {
          resolve(results);
        }
      });
    },
    updatePnL(){
      this.$store.dispatch(UPDATE_INTERNAL_PNL);
    },
    fetchOHLCRecurr(tableInputs, results) {
      return new Promise((resolve) => {
        if (tableInputs.length > 0) {
           let table = tableInputs;
          if (tableInputs[0].position === "USDT") {
            table = tableInputs.slice(1);
          }
          const data = {
            position: {
              market: `${table[0].position}USDT`,
              interval: "1440",
              time: `${(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toFixed(
                0
              )}`,
            },
            portfolioId: this.portfolioId,
          };
          console.log("data::", data);
          this.$store
            .dispatch(FETCH_OHLC_DATA, data)
            .then((result) => {
              console.log(`${table[0].position}USDT---->`, result);
              resolve(
                this.fetchOHLCRecurr(table.slice(1), [result, ...results])
              );
            })
            .catch(() =>
              resolve(this.fetchOHLCRecurr(table.slice(1), results))
            );
        } else {
          resolve(results);
        }
      });
    },
    fetchAssets() {
      return new Promise((resolve) => {
        const data = {
          portfolioId: this.portfolioId,
        };
        this.$store
          .dispatch(FETCH_ASSETS_DATA, data)
          .then((result) => resolve(result))
          .catch(() => resolve([]));
      });
    },
    bind_data() {
      this.columns = [
        //   { key: "action", label: "Actions", class: "actions text-center" },
        {
          key: "icon",
          label: "",
          thClass: "text-center w-30 bg-white",
          // variant: 'white',
          stickyColumn: true,
        },
        {
          key: "position",
          label: "Coin",
          thClass: "text-left w-90 bg-white",
          // variant: 'white',
          stickyColumn: true,
        },
        {
          key: "total-qty",
          label: "Total Qty.",
          thClass: "text-center w-90 bg-white",
          sortable: true,
        },
        {
          key: "total-amount",
          label: "Total Amount",
          thClass: "text-center w-90 bg-white",
          sortable: true,
        },
        {
          key: "target-weight",
          label: "Target Weight",
          thClass: "text-center w-90 bg-white",
          sortable: true,
        },
        {
          key: "current-weight",
          label: "Current Weight",
          thClass: "text-center w-90 bg-white",
          sortable: true,
        },
        {
          key: "mark-price",
          label: "Latest Mid Price",
          thClass: "text-center w-90 bg-white",
          sortable: true,
        },
        {
          key: "close1",
          label: "Yesterday Close Price",
          thClass: "text-center w-90 bg-white",
          sortable: true,
        },
        {
          key: "pnl-contribution",
          label: "P&L Contribution",
          sortable: true,
          thClass: "text-center w-90 bg-white",
        },
        {
          key: "total-pnl",
          label: "Total P&L",
          thClass: "text-center w-90 bg-white",
          sortable: true,
        },
        {
          key: "unrelized-pnl",
          label: "Unrealized P&L",
          thClass: "text-center w-90 bg-white",
          sortable: true,
        },
        {
          key: "relized-pnl",
          label: "Realized P&L",
          thClass: "text-center w-90 bg-white",
          sortable: true,
        },
        {
          key: "avg-bought-price",
          label: "Average Bought Price",
          thClass: "text-center w-90 bg-white",
          sortable: true,
        },
        {
          key: "avg-sold-price",
          label: "Average Sold Price",
          thClass: "text-center w-90 bg-white",
          sortable: true,
        },
        {
          key: "incoming-pnl",
          label: "Daily Incoming P&L",
          sortable: true,
          thClass: "text-center w-90 bg-white",
        },
        {
          key: "incoming-qty",
          label: "Incoming Qty.",
          thClass: "text-center w-90 bg-white",
          sortable: true,
        },
        {
          key: "trading-pnl",
          label: "Daily Trading P&L",
          sortable: true,
          thClass: "text-center w-90 bg-white",
        },
        {
          key: "trading-qty",
          label: "Trading Qty.",
          sortable: true,
          thClass: "text-center w-90 bg-white",
        },
        {
          key: "trading-sold-qty",
          label: "Trading Short Qty.",
          thClass: "text-center w-90 bg-white",
          sortable: true,
        },
        {
          key: "trading-bought-qty",
          label: "Trading Long Qty.",
          thClass: "text-center w-90 bg-white",
          sortable: true,
        },
        {
          key: "daily-avg-long-price",
          label: "Daily Avg. Established Price",
          thClass: "text-center w-90 bg-white",
          sortable: true,
        },
        {
          key: "daily-avg-short-price",
          label: "Daily Avg. Liquidation Price",
          thClass: "text-center w-90 bg-white",
          sortable: true,
        },
      ];

      this.table_option.total_rows = this.items.length;
      this.get_meta();
    },
    on_filtered(filtered_items) {
      this.refresh_table(filtered_items.length);
    },
    refresh_table(total) {
      this.table_option.total_rows = total;
      this.table_option.currentPage = 1;
    },
    get_meta() {
      var startPage;
      var endPage;
      var totalPages =
        this.table_option.page_size < 1
          ? 1
          : Math.ceil(
              this.table_option.total_rows / this.table_option.page_size
            );
      totalPages = Math.max(totalPages || 0, 1);

      var maxSize = 5;
      var isMaxSized = typeof maxSize !== "undefined" && maxSize < totalPages;
      if (isMaxSized) {
        startPage = Math.max(
          this.table_option.current_page - Math.floor(maxSize / 2),
          1
        );
        endPage = startPage + maxSize - 1;

        if (endPage > totalPages) {
          endPage = totalPages;
          startPage = endPage - maxSize + 1;
        }
      } else {
        startPage = 1;
        endPage = totalPages;
      }
      let startIndex =
        (this.table_option.current_page - 1) * this.table_option.page_size;
      let endIndex = Math.min(
        startIndex + this.table_option.page_size - 1,
        this.table_option.total_rows - 1
      );

      var pages = Array.from(Array(endPage + 1 - startPage).keys()).map(
        (i) => startPage + i
      );
      this.meta = {
        total_items: this.table_option.total_rows,
        current_page: this.table_option.current_page,
        page_size: this.table_option.page_size,
        total_pages: totalPages,
        start_page: startPage,
        end_page: endPage,
        start_index: startIndex,
        end_index: endIndex,
        pages: pages,
      };
    },

    //Export pdf/csv/print
    export_table(type) {
      let cols = this.columns.filter(
        (d) => d.key != "thumb" && d.key != "action"
      );
      let records = this.items;
      let filename = "table";

      if (type == "csv") {
        let coldelimiter = ",";
        let linedelimiter = "\n";
        let result = cols
          .map((d) => {
            return d.label;
          })
          .join(coldelimiter);
        result += linedelimiter;
        records.map((item) => {
          cols.map((d, index) => {
            if (index > 0) {
              result += coldelimiter;
            }
            let val = item[d.key] ? item[d.key] : "";
            result += val;
          });
          result += linedelimiter;
        });

        if (result == null) return;
        if (
          !result.match(/^data:text\/csv/i) &&
          !window.navigator.msSaveOrOpenBlob
        ) {
          var data =
            "data:application/csv;charset=utf-8," + encodeURIComponent(result);
          var link = document.createElement("a");
          link.setAttribute("href", data);
          link.setAttribute("download", filename + ".csv");
          link.click();
        } else {
          var blob = new Blob([result]);
          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename + ".csv");
          }
        }
      } else if (type == "print") {
        var rowhtml = "<p>" + filename + "</p>";
        rowhtml +=
          '<table style="width: 100%; " cellpadding="0" cellcpacing="0"><thead><tr style="color: #515365; background: #eff5ff; -webkit-print-color-adjust: exact; print-color-adjust: exact; "> ';
        cols.map((d) => {
          rowhtml += "<th>" + d["label"] + "</th>";
        });
        rowhtml += "</tr></thead>";
        rowhtml += "<tbody>";

        records.map((item) => {
          rowhtml += "<tr>";
          cols.map((d) => {
            let val = item[d.key] ? item[d.key] : "";
            rowhtml += "<td>" + val + "</td>";
          });
          rowhtml += "</tr>";
        });
        rowhtml +=
          "<style>body {font-family:Arial; color:#495057;}p{text-align:center;font-size:18px;font-weight:bold;margin:15px;}table{ border-collapse: collapse; border-spacing: 0; }th,td{font-size:12px;text-align:left;padding: 4px;}th{padding:8px 4px;}tr:nth-child(2n-1){background:#f7f7f7; }</style>";
        rowhtml += "</tbody></table>";
        var winPrint = window.open(
          "",
          "",
          "left=0,top=0,width=1000,height=600,toolbar=0,scrollbars=0,status=0"
        );
        winPrint.document.write("<title>Print</title>" + rowhtml);
        winPrint.document.close();
        winPrint.focus();
        winPrint.print();
        winPrint.close();
      } else if (type == "pdf") {
        cols = cols.map((d) => {
          return { header: d.label, dataKey: d.key };
        });
        const doc = new jsPDF("l", "pt", cols.length > 10 ? "a3" : "a4");
        doc.autoTable({
          headStyles: { fillColor: "#eff5ff", textColor: "#515365" },
          columns: cols,
          body: records,
          styles: { overflow: "linebreak" },
          pageBreak: "auto",
          margin: { top: 45 },
          didDrawPage: () => {
            doc.text("Export Table", cols.length > 10 ? 535 : 365, 30);
          },
        });
        doc.save(filename + ".pdf");
      }
    },
    excel_columns() {
      return {
        Position: "position",
        "target-weight": "target-weight",
        amount: "amount",
        "mark-price": "mark-price",
      };
    },
    excel_items() {
      return this.items;
    },
  },
};
</script>

