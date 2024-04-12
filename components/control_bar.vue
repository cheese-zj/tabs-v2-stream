<template>
  <div class="control-bar">
    <!-- <div class="interaction-block-2">
      <div class="block-label">Your Degree</div>
      <t-dropdown
        id="degree"
        minColumnWidth="230px"
        :options="degreeOptions"
        hideAfterItemClick
        trigger="click"
        @click="clickHandler"
      >
      <t-button id="degree_button" variant="outline" theme="default" :style="buttonStyle">{{ selectedDegree }}</t-button>
      </t-dropdown>
    </div> -->
      <t-dropdown
        minColumnWidth="190px"
        :options="majorOptions"
        hideAfterItemClick
        trigger="click"
        @click="clickHandlerMajor1"
      >
      <button id="major_button" variant="outline" theme="default" :style="buttonStyle">{{ selectedMajor1 }}</button>
      </t-dropdown>
      <t-dropdown
        minColumnWidth="190px"
        :options="majorOptions"
        hideAfterItemClick
        trigger="click"
        @click="clickHandlerMajor2"
      >
      <button id="major_button" variant="outline" theme="default" :style="buttonStyle">{{ selectedMajor2 }}</button>
      </t-dropdown>
    <div class="viewMajor_button" :class="{ 'displayMP': viewMajor }" @click="toggleViewMajor">
      <span class="material-symbols-outlined"> list </span>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { store } from '../store';

export default defineComponent({
  name: 'ControlBar',
  setup() {
    const selectedDegree = ref('Select Degree');
    const selectedMajor1 = ref('Select Major');
    const selectedMajor2 = ref('Select Major');
    const buttonStyle = ref({ color: '#8b8b8b'});

    const degreeOptions = ref([
      { content: 'Bachelor of Science', value: 1 },
      { content: 'Bachelor of Advanced Computing', value: 2 }
    ]);

    const majorOptions = ref([
      { content: 'Computer Science', value: 1 },
      { content: 'Software Development', value: 2 },
      { content: 'Computational Data Science', value: 3 },
      { content: 'Cyber Security', value: 4 },
      { content: null, value: 0 }
    ]);

    const clickHandler = (data) => {
      selectedDegree.value = data.content;
      store.degree = data.content;
      MessagePlugin.success(`selected: ${store.degree}`);
    };

    const clickHandlerMajor1 = (data) => {
      if (data.content == store.selectedMajor[1] && data.content != null) {
        store.selectedMajor[1] = store.selectedMajor[0];
        store.selectedMajor[0] = data.content;
        selectedMajor2.value = selectedMajor1.value;
        selectedMajor1.value = data.content;
        return;
      }
      selectedMajor1.value = data.content;
      store.selectedMajor[0] = data.content;
      MessagePlugin.success(`selected: ${store.selectedMajor[0]}`);
    };

    const clickHandlerMajor2 = (data) => {
      if (data.content == store.selectedMajor[0] && data.content != null) {
        store.selectedMajor[0] = data.content;
        selectedMajor1.value = selectedMajor2.value;
        selectedMajor2.value = data.content;
      } else {
        selectedMajor2.value = data.content;
        store.selectedMajor[1] = data.content;
      }
      MessagePlugin.success(`selected: ${store.selectedMajor[1]}`);
    };

    const toggleViewMajor = () => {
      store.viewMajor = !store.viewMajor;
    };

    const viewMajor = computed(() => store.viewMajor);
        
    return { selectedDegree, degreeOptions, clickHandler, clickHandlerMajor1, clickHandlerMajor2, buttonStyle, majorOptions, selectedMajor1, selectedMajor2, toggleViewMajor, viewMajor };
  }
});
</script>


  
<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap');


.control-bar {
    display: flex;
    justify-content: center; /* Center children horizontally */
    align-items: center; /* Center children vertically */
    background-color: #eaeaea;
    /* Ensure the component itself has margins auto to center in its parent */
    width: 100%;
    flex-shrink: 0;
    border-radius: 80px;
    box-sizing: border-box;
    position: relative;
}

.viewMajor_button .material-symbols-outlined {
    min-width: 40px;
    max-height: 10px;
    padding-left: 20px;
    padding-bottom: 15px;
    padding-top: 5px;
    border-radius: 50px;
    margin: 10px;
    margin-left: 5px;
    cursor: pointer;
    flex-direction: column; /* Stack elements vertically */
    border: 2px solid #989898;
    box-shadow: 0px 4px 4px 0.0px rgba(133, 133, 133, 0.2);
    transition: 0.2s;
    font-size: 20px;
    user-select: none;
}

#major_button:hover {
    background-color: #f8f8f858;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    transition: 0.2s;
}

.viewMajor_button .material-symbols-outlined:hover{
    background-color: rgba(255, 94, 0, 0.9);
    box-shadow: 0px 0px 8px rgba(255, 102, 0, 0.885);
    color: rgb(244, 244, 244);
    border: 2px solid #ffffff00;
    transition: 0.2s;
    transform: scale(1.05);
}

.viewMajor_button .material-symbols-outlined:active{
    background-color: rgb(255, 102, 0);
    box-shadow: 0px 0px 12px rgba(255, 102, 0, 0.885);
    color: rgb(244, 244, 244);
    transition: 0.2s;
    transform: scale(0.98);
}


.block-label {
  margin-bottom: 5px;
  font-family: "Roboto Mono", monospace;
  font-optical-sizing: auto;
  font-weight: 550;
  font-style: normal;
  font-size: 0.82vw;
}

#degreeStartYear {
    width: 100%; /* Adjust the width as needed */
}

#degree_button {
    width: 100%;
    font-family: "Roboto Mono", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    color: #8b8b8b;
    font-style: italic;
    font-size: 0.78vw;
}

#major_button {
    min-height: 35px;
    font-family: "Roboto Mono", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    /* font-optical-sizing: auto; */
    font-weight: 400;
    color: #d4d4d4;
    font-style: italic;
    font-size: 9.0px;
    margin-bottom: 2px;

    overflow: hidden;
    max-width: 85px;
    min-width: 85px;
    padding-top: 3px;
    border-radius: 20px;
    margin: 5px;
    flex-direction: column;
    border: 2px solid #989898;
    box-shadow: 0px 4px 4px 0.0px rgba(133, 133, 133, 0.2);
    transition: 0.2s;
    overflow: hidden;
}

#major_button:active {
  transform: scale(0.96);
  box-shadow: 0px 0px 8px 0.0px #ffffffaf;
  transition: 0.1s;
  /* background-color: rgba(255, 255, 255, 0.817); */
  border: 2px solid #cdcdcd;
}

</style>
  