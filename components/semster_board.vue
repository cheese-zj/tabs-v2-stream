<template>
    <div class="board">
        <div class="academic-year-container" 
            v-for="year in academicYears" :key="`year-${year}`">
            <div class="yr-tag"> Year-{{ year }} </div>
            <div class="semester-container" v-for="semester in [1, 2]" :key="`year-${year}-semester-${semester}`">
                <div class="drop-zone-container"
                     @drop="onDrop($event, semester, year)"
                     @dragover.prevent
                     @dragenter.prevent>
                    <div v-for="item in getItems(semester, year)"
                        :key="item.id"
                        class="drag-el"
                        :class="{ 'selected': item.id === store.selectedItemId, animating: item.animating }"
                        :style="{ backgroundColor: item.color, width: getItemWidth(semester, year) + '%' }"
                        draggable="true"
                        @click="selectItem(item)"
                        @dragstart="startDrag($event, item)"
                        >
                        <div class="text-container">{{ item.id }}</div>
                        <button class="delete-button" @click.stop="deleteItem(item)">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                        <div class="inner-block">
                            {{ item.name }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="button-container">
            <button class="add-year-button" @click="addAcademicYear">
                <span class="material-symbols-outlined">add</span>
            </button>
            <button class="add-year-button" @click="minusAcademicYear">
                <span class="material-symbols-outlined">remove</span>
            </button>
            <button class="add-year-button" @click="cleanBoard">
                <span class="material-symbols-outlined">delete_sweep</span>
            </button>
        </div>
    </div>
</template>



<script>
import { defineComponent, ref } from 'vue';
import { store } from '../store';

export default defineComponent({
    setup() {
        const academicYears = ref([1, 2, 3]); // Example: 3 academic years
        const draggingItem = ref(null);
        
        const items = store.items;

        const selectItem = (item) => {
            store.selectedItemId = store.selectedItemId === item.id ? null : item.id;
        };

        const getItems = (slot, semester, year) => {
            return store.items.filter(item => item.slot === slot && item.semester === semester && item.year === year);
        };

        const startDrag = (event, item) => {
            draggingItem.value = item;
            event.dataTransfer.setData('item', JSON.stringify(item));
        };

        const onDrop = (event, slot, semester, year) => {
            const itemData = JSON.parse(event.dataTransfer.getData('item'));
            let fromItemIndex = store.items.findIndex(item => item.id === itemData.id);
            let fromItem = store.items[fromItemIndex];
            let targetItemIndex = store.items.findIndex(item => item.slot === slot && item.semester === semester && item.year === year);

            // if (fromItemIndex === -1 && targetItemIndex !== -1) {
            //     console.log("Drop cancelled: Slot is occupied.");
            //     return;
            // }

            // Dragging from outside into the board
            if (fromItemIndex === -1) {
                const newItem = { ...itemData, slot, semester, year };
                store.items.push(newItem);
                // Handle animation or other state updates if necessary
                newItem.animating = true;
                setTimeout(() => newItem.animating = false, 500);
                return;
            }

            // If target slot is occupied and different from the fromItem's slot
            if (targetItemIndex !== -1 && fromItemIndex !== targetItemIndex) {
                const targetItem = store.items[targetItemIndex];
                
                // Swapping slots, semesters, and years
                // [fromItem.slot, targetItem.slot] = [targetItem.slot, fromItem.slot];
                // [fromItem.semester, targetItem.semester] = [targetItem.semester, fromItem.semester];
                // [fromItem.year, targetItem.year] = [targetItem.year, fromItem.year];
                // targetItem.animating = true;
                fromItem.slot = slot;
                fromItem.semester = semester;
                fromItem.year = year;

                const targetIndex = getItems(semester, year).length;
                fromItem.order = targetIndex;
                store.items.splice(fromItemIndex, 1); 
                store.items.push(fromItem); 

                fromItem.animating = true;
                setTimeout(() => fromItem.animating = false, 500);
            }
            // Moving to an empty slot within the board
            else
            if (targetItemIndex === -1) {
                fromItem.slot = slot;
                fromItem.semester = semester;
                fromItem.year = year;
            }

            // Handle animation for moving or swapping
            fromItem.animating = true;
            setTimeout(() => fromItem.animating = false, 500);
            if (targetItem.animating) {
                setTimeout(() => targetItem.animating = false, 500);
            }
            store.items.splice(fromItemIndex, 1, fromItem);
        };


        const addAcademicYear = () => {
            if (academicYears.value.length <= 0) {
                academicYears.value.push(1);
                return ;
            }
            const maxYear = Math.max(...academicYears.value);
            academicYears.value.push(maxYear + 1);
        };

        const minusAcademicYear = () => {
            if (academicYears.value.length > 0) {
                academicYears.value.pop();
            }
        };

        const cleanBoard = () => {
            store.items = [];
        }

        const deleteItem = (itemToDelete) => {
            const index = store.items.findIndex(item => item.id === itemToDelete.id);
            if (store.selectedItemId === itemToDelete.id) {
                store.selectedItemId = null;
            }
            if (index > -1) {
                store.items.splice(index, 1);
            }
        };

        const dropZoneCounts = ref({});

        academicYears.value.forEach(year => {
            [1, 2].forEach(semester => {
                const key = `year-${year}-semester-${semester}`;
                dropZoneCounts.value[key] = 4;
            });
        });

        const getDropZoneCount = (year, semester) => {
            const key = `year-${year}-semester-${semester}`;
            return dropZoneCounts.value[key] || 0;
        };

        const getItemWidth = (semester, year) => {
            const itemCount = getItems(semester, year).length;
            return itemCount > 0 ? 100 / itemCount : 100; // Prevent division by zero
        };

        return {
            academicYears,
            getItems,
            startDrag,
            onDrop,
            items,
            selectItem,
            addAcademicYear,
            minusAcademicYear,
            deleteItem,
            store,
            academicYears,
            dropZoneCounts,
            getDropZoneCount,
            academicYears,
            getItemWidth,
            cleanBoard
        };
    }
});

</script>


<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap');
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,500,0,0");

.board {
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    width: 100%;
    /* border: 2px solid #FF8C4B; */
}


.academic-year-container {
    background-color: #EAEAEA;
    border-radius: 34px;
    justify-content: center;
    width: auto;
    flex-wrap: wrap;
    margin: 15px;
    border: 2px solid #989898a8;
    transition: 0.2s;
}

.yr-tag {
    display: flex; 
    justify-content: start;
    min-height: 40px;
    max-height: 40px;
    padding-top: 0px;
    padding-left: 0px;
    padding-right: 0px;
    padding-bottom: 0px;
    overflow-x: auto;
    overflow-y: auto;
    width: 90%;
    flex-wrap:nowrap;
    z-index: -1;
    /* background-color: #b1b1b156; */
    border-radius: 10px 10px 0px 0px;
    margin: 1%;
    margin-top: 1%;
    margin-bottom: 1%;
    margin-left: 5%;
    /* border: 2px solid #989898; */
    border-bottom: 2px dashed #9898985b;
    background-color: none;
    font-family: "Roboto Mono", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 30px;
    font-style: normal;
    font-weight: 700;
    color: #9898989e;
    line-height: normal;
}


.drop-zone-container {
    display: flex; 
    justify-content: start;
    min-height: 100px;
    max-height: 100px;
    padding-top: 18px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 13px;
    border-radius: 22px;
    overflow-x: auto;
    overflow-y: auto;
    
    flex-wrap:nowrap;
    z-index: 3;
    background-color: #ededed9c;
    border-radius: 28px;
    margin: 1%;
    border: 2px solid #989898;
    box-shadow: 0px 6px 6px 0.0px rgba(133, 133, 133, 0.2);
    background-color: none;
}


.drag-el {
    
    align-content: space-around;
    background-color: lightskyblue;
    color: white;
    border-radius: 16px;
    filter: drop-shadow(0px 4px 2px rgba(124, 124, 124, 0.15));
    min-height: 90px;
    max-height: 90px;
    z-index: inherit;
    cursor: grab;
    border: 2px solid #ffffff8f;
    transition: 0.2s;
    margin-left: 2px;
    margin-right: 2px;
    border-radius: 16px;
    padding-left: 2px;
    padding-right: 2px;
    outline: none;
    min-width: 10%;
    max-width: 23.33%;
    cursor: grab;
    border: 2px solid #ffffff8f;
    transition: 0.14s;
    
}

.text-container {
    font-family: "Roboto Mono", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-optical-sizing: auto;
    font-weight: 600;
    font-style: normal;
    font-size: 12px;
    margin-top: 2px;
    margin-left: 7.6px;
    margin-bottom: 3px;
    transform: translate(0%, 0%);
    min-height: 18%;
    color: rgba(255, 255, 255, 0.90);
}

.inner-block {
    font-family: "Roboto", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 400;
    font-style: normal;
    padding: 8px;
    border-radius: 12px; 
    background-color: rgba(255, 255, 255, 0.90);
    text-align: left;
    font-size: 12px;
    line-height: normal;
    color: rgba(55, 55, 55, 0.851);
    width: 100%;
    overflow: hidden;
    word-wrap: break-word;
    height: 72%;
    min-height: 48%;
    box-sizing: border-box;
}
@keyframes swap-animation {
    0% {
        opacity: 0;
        transform: scale(0.7) translate(-0.0%, -7%);
        box-shadow: 0px 0px 8.8px 5px rgba(255,255,255, 0.0);
    }
    50% {
        opacity: 0.5;
        transform: scale(1.02) translate(-0.0%, -10%);
        box-shadow: 0px 0px 8.8px 5px rgba(255,255,255, 1);
    }
    100% {
        opacity: 1;
        transform: scale(1) translate(-0.0%, 0%);
        box-shadow: 0px 0px 8.8px 5px rgba(255,255,255, 0.0);
    }
}



.drag-el.animating {
    animation: swap-animation 0.5s ease-in-out;
}

.drag-el.selected {
    box-shadow: 0px 0px 10px 5px rgba(255,255,255, 1);
    cursor: grab;
    transform: scale(1.02);
    transition: 0.1s;
}

/* Custom styling for the element when it is being dragged */
.drag-el:active {
    outline: none;
    box-shadow: 0px 0px 0px 0px rgba(255,255,255, 0);
    opacity: 0.8;
    transition: 0.15s;
    transform: scale(1) translate(-0.0%, -0%);
}
.drag-el:focus {
    outline: none;
    box-shadow: 0px 0px 0px 0px rgba(255,255,255, 0);
    opacity: 0.8;
    transition: 0.15s;
    transform: scale(1) translate(-0.0%, -0%);
}

.drag-el:hover {
    border: 2px solid #525252b7;
    box-shadow: 0px 0px 0px 1px rgba(255, 255, 255, 0.419);
    transition: 0.15s;
    transform: scale(1.0) translate(0%, -0%);
}


.delete-button {
    position: absolute;
    top: 0;
    right: 0;
    background-color: rgba(87, 87, 87, 0.274);
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    opacity: 0.0;
    margin: 4px;
    height: 24px;
    width: 28px;
    
    overflow: hidden;
    transition: 0.2s;
}

.delete-button:hover {
    background-color: rgba(232, 66, 66, 0.888);
    transition: 0.2s;
}

.delete-button .material-symbols-outlined {
    color: rgba(255, 255, 255, 0.85);
    transform: translate(-0.0vw, 0.1vw);
    font-size: 16px;
}

.drag-el:hover .delete-button {
    opacity: 1;
}


.drag-el:nth-last-of-type(1) {
    margin-bottom: 0;
}

.timeline {
    border-radius: 0.15vw;
    position: absolute;
    left: -1vw;
    top: 0;
    bottom: 0;
    width: 0.3vw; 
    background-color: #FF8C4B;
    z-index: 0; 
}

.button-container {
    display: flex;
    width: 40%;
    max-height: 40px;
    margin-top: 8px;
    margin-left: 30%;
    /* border: black solid 2px; */
    align-content: space-around;
}

.add-year-button {
    font-size: 10px;
    color: rgba(216, 216, 216, 0.499);
    background-color: #ffffff;
    padding: 5px;
    border-radius: 10px;
    border: dashed 2px #d4d4d4;
    justify-content: center;
    cursor: pointer;
    width: 100%;
    margin: 2px;
    transition: 0.3s;
}  

.add-year-button:hover {
    border: solid 2px #ff4f04e8;
    transition: 0.3s;
    background-color: #ffbe9833;
}

.add-year-button:hover .material-symbols-outlined {
    color: rgba(255, 106, 0, 0.883);
    transition: 0.3s;
}

.add-year-button:active {
    border: solid 2px #ff7236;
    transition: 0.3s;
    background-color: #ffd5bdb7;
    transform: scale(0.95);
}

</style>
