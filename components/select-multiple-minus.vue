<template>
  <div>
    <div class="cursor-pointer" @click="openMenu()">
      <q-menu
        class="rounded-lg shadow-md border-[0.9px] bg-zinc-50"
        :offset="[10, 10]"
        fit
        ref="menu"
      >
        <div class="p-2">
          <div v-if="props?.useSearch">
            <q-input dense outlined="" label="Rechercher ..."></q-input>
          </div>
          <div class="pt-4">
            <q-list dense separator="">
              <q-item
                @click="selectItem(item)"
                :class="isActive(item) ? 'text-primary' : ''"
                class="rounded-md"
                clickable=""
                v-for="item of state.items"
              >
                <q-item-section>
                  <q-item-label>
                    {{ showLabel(item) }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon
                    color="primary"
                    name="mdi-check"
                    v-if="isActive(item)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
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
              :color="props?.prependIconColor || 'black'"
              size="xs"
              :name="props.prependIcon"
            ></q-icon>
          </div>
        </template>
        <template #control>
          <div>
            {{ state.selected?.length }}
            {{ $attrs?.label || "" }}
          </div>
        </template>
      </q-field>
    </div>
  </div>
</template>

<script setup lang="ts">
import { deepEqual, _ } from "@/utils";
const model = defineModel();
const props = defineProps<{
  useSearch?: boolean;
  optionKey?: string;
  options?: any[];
  optionLabel?: string | Function;
  prependIcon?: string;
  prependIconColor?: string;
  optionValue?: string | Function;
}>();
const state = reactive({
  open: false,
  items: props?.options || [],
  selected: model.value || [],
});
const menu = ref(null);
watch(
  () => props.options,
  (value) => {
    state.items = value;
  }
);

watch(
  () => state.selected,
  (val) => {
    setValue();
  }
);

function setValue() {
  //console.log("State selected before do model set", state.selected);
  let selected = [...state.selected];
  if (props?.optionValue) {
    if (typeof props.optionValue == "string") {
      selected = selected.map((i) => i[props.optionValue] || i);
    }

    if (typeof props.optionValue == "function") {
      selected = selected.map((i) => props?.optionValue(i) || i);
    }
  } else {
  }

  selected = [...new Set(selected)];
  selected = selected.filter((i) => i !== undefined && i !== null);

  model.value = selected;
}

function openMenu() {
  //alert("ok");

  state.open = true;
  //menu.value.show();
}

function alreadySelected(item) {
  let key = props?.optionKey || "_id";
  let status = false;
  state?.selected?.map((i) => {
    if (deepEqual(i, item)) {
      status = true;
    }
    if (i?.[key] == item?.[key]) {
      status = true;
    }
    if (i == item) {
      status = true;
    }
    if (i == item[key]) {
      status = true;
    }
  });

  return status;
}
function isActive(item: any) {
  let status = alreadySelected(item);
  return status;
}

function selectItem(item) {
  let selected = [...state.selected];
  let key = props?.optionKey || "_id";
  let findItem = null;
  state?.selected?.map((i) => {
    if (alreadySelected(item)) {
      findItem = item;
    }
  });

  if (findItem) {
    selected = state.selected?.filter((i) => !deepEqual(i, item));
    selected = selected?.filter((i) => i?.[key] != item?.[key]);
    selected = selected?.filter((i) => i != item[key]);
  } else {
    selected.push(item);
  }

  state.selected = selected;
}

function showLabel(item) {
  if (typeof props?.optionLabel === "string") {
    return props.optionLabel ? item[props.optionLabel] : item;
  }

  if (typeof props?.optionLabel === "function") {
    return props.optionLabel(item);
  }
}
</script>
