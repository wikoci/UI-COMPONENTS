<template>
  <div>
    <q-tooltip
      class="bg-red-50 text-black"
      self="center right"
      anchor="center right"
      v-if="props?.locked"
    >
      Champ vérouillé
    </q-tooltip>
    <div
      :class="props?.locked ? 'no-pointer-events' : 'cursor-pointer'"
      @click="openMenu()"
    >
      <q-menu class="shadow-0 bg-transparent" :offset="[0, 0]" fit ref="menu">
        <div class="p-2">
          <div v-if="props?.useSearch">
            <q-input dense outlined="" label="Rechercher ..."></q-input>
          </div>
          <div class="pt-1 border-[1px] bg-zinc-100 p-2 rounded-lg">
            <q-virtual-scroll
              style="max-height: 26vh"
              :items="state.items"
              separator
            >
              <template v-slot="{ item, index }">
                <q-item
                  :key="index"
                  dense
                  @click="selectItem(item)"
                  :class="isActive(item) ? 'text-primary' : ''"
                  class="rounded-md"
                  clickable=""
                >
                  <q-item-section v-if="props.useIcon" side>
                    <q-icon
                      :color="setIconColor(item) || ''"
                      size="xs"
                      :name="setIconNameList(item)"
                    ></q-icon>
                  </q-item-section>
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
              </template>
            </q-virtual-scroll>
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
              size="20px"
              :color="setIconColor(state.selected) || ''"
              :name="setIconName(props.prependIcon)"
            ></q-icon>
          </div>
        </template>

        <template v-if="props?.locked" #append>
          <div>
            <q-icon size="20px" name="mdi-lock"> </q-icon>
          </div>
        </template>
        <template v-if="props?.appendIcon && !props?.locked" #append>
          <div>
            <q-icon
              size="20px"
              :color="setIconColor(state.selected) || ''"
              :name="setIconName(props.appendIcon)"
            ></q-icon>
          </div>
        </template>
        <template #control>
          <q-item-label class="" :lines="1" v-if="state.selected">
            {{ showLabel(state.selected) }}
          </q-item-label>
          <div v-else>{{ $attrs?.label || "" }}</div>
        </template>
      </q-field>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from "lodash";
import { deepEqual } from "@/utils";
const model = defineModel();
const props = defineProps<{
  useSearch?: boolean;
  options?: Array<any>;
  optionLabel?: string;
  prependIcon?: string | Function;
  prependIconColor?: string | Function;
  appendIcon?: string | Function;
  locked?: boolean;
  useIcon?: boolean;
}>();
const state = reactive({
  open: false,
  items: props?.options || [],
  selected: model.value || null,
});
watch(
  () => props.options,
  (value) => {
    state.items = value;
  }
);

const menu = ref(null);

function openMenu() {
  //alert("ok");

  if (props?.locked) {
    return;
  }

  state.open = true;
  //menu.value.show();
}
function isActive(item: any) {
  return deepEqual(state.selected, item);
}

function setIconNameList(item: any) {
  try {
    if (typeof props?.prependIcon === "string") {
      return item[props.prependIcon];
    }

    if (typeof props?.prependIcon === "function") {
      return props.prependIcon(item);
    }
    return "";
  } catch (err) {
    console.error(err?.message);
    return "";
  }
}

function setIconName(icon: any) {
  if (typeof icon === "string") {
    return icon;
  }

  if (typeof icon === "function") {
    return icon(state.selected);
  }

  return "";
}

function setIconColor(item) {
  try {
    if (typeof props?.prependIconColor === "string") {
      return item[props.prependIconColor];
    }

    if (typeof props?.prependIconColor === "function") {
      return props.prependIconColor(item);
    }
    return "";
  } catch (err) {
    //console.error(err?.message);
    return "";
  }
}

function selectItem(item) {
  if (deepEqual(state.selected, item)) {
    state.selected = null;
  } else {
    state.selected = item;
  }

  model.value = state.selected;
  menu.value.hide();
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
