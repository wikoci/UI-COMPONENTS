<template>
  <div>
    <q-btn-dropdown
      content-class="shadow-0 bg-transparent !p-1"
      round
      v-bind="$attrs"
      flat=""
      dropdown-icon="bi-three-dots-vertical"
    >
      <div class="border-[1px] bg-zinc-50 shadow-md !rounded-lg">
        <div class="" flat>
          <q-list :separator="true">
            <div v-for="item of props.options">
              <q-item
                v-close-popup=""
                dense
                class="!py-2"
                v-bind="item"
                v-if="item?.type !== 'separator'"
                :clickable="true"
              >
                <q-item-section side>
                  <q-icon
                    :color="item?.iconColor || 'black'"
                    :name="item?.icon"
                  ></q-icon>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="action-item">
                    {{ item?.label }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-separator v-if="item?.type == 'separator'" />
            </div>
          </q-list>
        </div>
      </div>
    </q-btn-dropdown>
  </div>
</template>
<script setup lang="ts">
const emit = defineEmits(["onItemClick"]);
import type { QItemProps } from "quasar";
type optionActionType = QItemProps & {
  id?: string;
  icon: string;
  label: string;
  iconColor?: string;
  type?: "separator" | "item" | "header";
};

const props = defineProps<{
  options: Array<optionActionType>;
}>();

function onClick(item: optionActionType) {
  if (item?.type === "separator") return;
  emit("onItemClick", item);
}
</script>
