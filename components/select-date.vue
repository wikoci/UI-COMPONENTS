<template>
  <div>
    <div class="cursor-pointer">
      <q-menu
        class="rounded-lg shadow-2xl border-[0.9px]"
        :offset="[10, 10]"
        fit
        ref="menu"
      >
        <q-card class="p-2">
          <q-card-actions>
            <div class="font-bold">{{ $attrs?.label || "Date" }}</div>
            <q-space />
            <q-btn round flat dense icon="mdi-close" v-close-popup></q-btn>
          </q-card-actions>
          <q-separator spaced />

          <q-card-section class="scroll" style="height: 28vh">
            <q-date
              minimal=""
              format="YYYY-MM-DD"
              mask="YYYY-MM-DD"
              landspace
              flat
              v-model="state.date"
              lang="fr"
            ></q-date
          ></q-card-section>
          <q-separator spaced />
          <q-card-actions>
            <q-btn
              @click="state.date = moment().format('YYYY-MM-DD')"
              no-caps
              flat
              class="btn bg-blue-50"
              color="primary"
              label="Aujourd'hui"
            ></q-btn>
            <q-space />
            <q-input
              dense
              outlined=""
              v-model="state.time"
              type="time"
            ></q-input>
          </q-card-actions>
          <q-card-actions>
            <q-btn
              @click="save()"
              no-caps
              color="primary"
              class="btn fit !px-10"
              label="Enregistrer"
            ></q-btn>
          </q-card-actions>
        </q-card>
      </q-menu>
      <q-field
        :stack-label="false"
        class="no-pointer-events"
        v-bind="{
          ..._.omit($attrs, ['label']),
        }"
        outlined=""
      >
        <template v-if="props.prependIcon" #prepend>
          <div>
            <q-icon
              :color="props?.prependIconColor"
              size="xs"
              :name="props.prependIcon"
            ></q-icon>
          </div>
        </template>
        <template #control>
          <q-item-label :lines="1" v-if="model">
            {{ moment(model).format("DD MMM YY , HH:mm") }}
          </q-item-label>
          <div v-else>{{ $attrs?.label || "" }}</div>
        </template>
      </q-field>
    </div>
  </div>
</template>

<script setup lang="ts">
import { deepEqual, _, moment } from "@/utils";
const model = defineModel();
const props = defineProps<{
  optionLabel?: string;
  prependIcon?: string | Function;
  prependIconColor?: string | Function;
}>();
const state = reactive({
  open: false,
  date: null,
  time: "08:00",
});

//console.log("model value date", model.value);

if (model?.value) {
  state.date = moment(model.value).format("YYYY-MM-DD");
  state.time = moment(model.value).format("HH:mm");
}

const menu = ref(null);

function save() {
  let [h, m] = state.time.split(":").map(Number);
  let dateTime = moment(state.date)
    .set({
      hour: h || 8,
      minute: m || 0,
    })
    .format("YYYY-MM-DDTHH:mm");

  model.value = dateTime;

  menu.value.hide();
}
</script>
