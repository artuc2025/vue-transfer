          <v-card class="py-7 px-7 position-relative">
            <v-card-subtitle class="rate-card-subtitle opacity-100 bg-light-blue-2 px-5 mb-2" :class="{'focused-1': isFocusedHave}" >
              <div class="d-flex align-center justify-space-between">
                <v-col cols="7" class="pa-0">
                  <span class="text-caption text-dark-blue-2 d-block">Ես ունեմ</span>
                  <v-text-field class="rate-price font-weight-medium text-dark-blue-2" @focus="onFocusHave" @blur="onBlurHave"  placeholder="Մուտքագրել" />
                </v-col>
                <v-col cols="3" class="rate-column-select pa-0">
                  <v-autocomplete
                      data-test="v-currency-autocomplete-cash-1"
                      class="v-autocomplete--rate text-body-2 font-weight-medium"
                      v-model="moneyPossessState"
                      label=""
                      :items="['AMD', 'USD', 'RUB', 'EUR']"
                      variant="outlined"
                      menu-icon="mdi-chevron-down"
                      :focused="false"
                  ></v-autocomplete>
                </v-col>
              </div>
            </v-card-subtitle>
            <div class="rate-vector-block position-absolute bg-background rounded-circle cursor-pointer">
              <v-hover v-slot="{ isHovering, props }" open-delay="160">
                <div  v-bind="props">
                  <RateVectors :fill="isHovering ? primary : vectorFill"  />
                </div>
              </v-hover>
            </div>
            <v-card-subtitle class="rate-card-subtitle opacity-100 bg-light-blue-2" :class="{'focused-2': isFocusedMust}">
              <div class="d-flex align-center justify-space-between">
                <v-col cols="7" class="pa-0">
                  <span class="text-caption text-dark-blue-2 d-block">Ինձ պետք է</span>
                  <v-text-field class="rate-price font-weight-medium text-dark-blue-2" placeholder="Մուտքագրել" @focus="onFocusMust" @blur="onBlurMust"  />
                </v-col>
                <v-col cols="3" class="rate-column-select pa-0">
                  <v-autocomplete
                      data-test="v-currency-autocomplete-cash-2"
                      class="v-autocomplete--rate text-body-2 font-weight-medium"
                      v-model="moneyNeedState"
                      label=""
                      :items="['AMD', 'USD', 'RUB', 'EUR']"
                      variant="outlined"
                      menu-icon="mdi-chevron-down"
                      :focused="false"
                  ></v-autocomplete>
                </v-col>
              </div>
            </v-card-subtitle>
          </v-card>
