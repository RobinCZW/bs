import throttle from 'lodash/throttle';
import Vue from 'vue';

const INNER_HEIGHT = window.innerHeight;
const DIRECTION_UP = 0;
const DIRECTION_DOWN = 1;
/**
 * ListView component constructor
 *
 * @param itemComponent - The component used as list item in v-for
 * @returns listView vue component object
 * @constructor
 */
export default function FixHeightListView(itemComponent = {template: ''}) {
    /* Force setting itemComponent's prop */
    itemComponent.props = {item: {type: Object}};
    /* Force setting replace to false to use keep-alive (fragment instances are not supported by keep-alive)*/
    itemComponent.replace = false;
    return {
        template: `
            <div class="list-view">
                <slot name="list-start"></slot>
                <div v-for="item in items" track-by="$index" class="list-view-item" :style="{height: placeholders[$index] + 'px'}">
                    <list-view-item v-if="visibility[$index]" :item="item" keep-alive></list-view-item>
                </div>
                <slot name="list-end"></slot>
            </div>
        `,
        props: {
            items: {
                type: Array,
                required: true
            },
            scrollElement: {
                default: null
            },
            loadMore: {
                type: Function
            },
            itemHeight: {
                type: Number,
                default: 0
            }
        },
        components: {
            listViewItem: itemComponent
        },
        data: () => ({
            placeholders: [],
            visibility: []
        }),
        ready() {
            this.preloadHeight = this.preloadScreens * INNER_HEIGHT;
            if (this.scrollElement) {
                this.scrollElement.addEventListener('scroll', this.scrollHandler)
            } else {
                this.$el.style.overflowY = 'auto';
                this.$el.style.height = '100%';
                this.$el.addEventListener('scroll', this.scrollHandler)
            }
            this.scrollHeight = 0
            this.scrollTop = 0
        },
        beforeDestroy() {
            this.scrollElement && this.scrollElement.removeEventListener('scroll', this.scrollHandler)
        },
        methods: {
            scrollHandler: throttle(function () {
                var el = this.$el;
                if (!el) return;
                /* Check scrolling up or down */
                var oldScrollTop = this.scrollTop;
                var newScrollTop = !this.scrollElement ? el.scrollTop : this.scrollElement.scrollTop;
                var direction = oldScrollTop > newScrollTop ? DIRECTION_UP : DIRECTION_DOWN;
                this.scrollTop = newScrollTop;

                /* Check if scrolled to end */
                if (INNER_HEIGHT + newScrollTop >= this.scrollHeight) {
                    if (this.loadMore) {
                        this.loadMore();
                    }
                    /* Note: $dispatch is deprecated in vue 2.0 */
                    else if (this.$dispatch) {
                        this.$dispatch('list-view:scrolled-to-end');
                    }
                }

                this.checkVisibility(direction);
            }, 50),
            /* GC invisible items and Restore visible items if necessary */
            checkVisibility(direction) {
                if (!this.$el) return;
                var preloadHeight = this.preloadHeight;
                var els = this.els; // this.$el.querySelectorAll('.list-view-item');
                var visibility = this.visibility, placeholders = this.placeholders;
                var scrollTop = this.scrollTop;
                var eachHeight = this.eachHeight;

                /* If we don't know the scrolling direction, we must check all the items */
                var checkStart = 0, checkEnd = visibility.length - 1;

                /* Whether to skip checking */
                var skip = false;

                /* If scrolling up, we only need to check visible items plus those before them */
                if (direction == DIRECTION_UP) {
                    checkEnd = visibility.lastIndexOf(true);
                    /* using a reversed loop for efficiency */
                    for (let i = checkEnd; i >= checkStart; i--) {
                        if (skip) {
                            // Vue.set(visibility, i, false);
                            visibility.$set(i, false);
                        } else {
                            checkElem(i);
                            if (i < checkEnd && !visibility[i] && visibility[i + 1]) skip = true;
                        }
                    }
                } else {
                    /* If scrolling down, we only need to check visible items plus those after them */
                    if (direction == DIRECTION_DOWN) checkStart = visibility.indexOf(true);
                    for (let i = checkStart; i <= checkEnd; i++) {
                        if (skip) {
                            // Vue.set(visibility, i, false);
                            visibility.$set(i, false);
                        } else {
                            checkElem(i);
                            if (i > checkStart && !visibility[i] && visibility[i - 1]) skip = true;
                        }
                    }
                }

                function checkElem(i) {
                    var offsetTop
                    if (eachHeight > 0) {
                        offsetTop = i * eachHeight
                    } else {
                        offsetTop = els[i].offsetTop
                    }
                    var top = offsetTop - scrollTop;
                    var bottom = top + placeholders[i];
                    visibility.$set(i, bottom > -preloadHeight && top < preloadHeight);
                }
            }
        },
        watch: {
            items: {
                immediate: true,
                handler(items, oldItems) {
                    var placeholders = this.placeholders = new Array(items.length),
                        visibility = this.visibility = new Array(items.length),
                        shrinked = oldItems && (oldItems.length > items.length);

                    if (this.eachHeight > 0) {
                        for (let i = 0, len = items.length; i < len; i++) {
                            visibility.$set(i, false)
                        }
                        for (let i = 0, len = placeholders.length; i < len; i++) {
                            placeholders.$set(i, this.eachHeight)
                        }
                        this.checkVisibility();
                        this.$nextTick(() => {
                            // this.els = this.$el.querySelectorAll('.list-view-item')
                            if (!this.$el) return
                            this.els = this.$el.querySelectorAll('.list-view-item')
                            this.scrollHeight = this.$el.scrollHeight
                        })
                        return
                    }

                    /* Re-initialize visibility table and bypass vue's watcher */
                    for (let i = 0, len = items.length; i < len; i++) {
                        visibility.$set(i, true)
                    }
                    /* Wait for vue to update dom */
                    this.$nextTick(() => {

                        /* Update elements' heights(placeholders) */
                        var els = this.$el.querySelectorAll('.list-view-item');
                        this.els = els;
                        for (let i = 0, len = els.length; i < len; i++) {
                            /* Measure element height */
                            placeholders.$set(i, els[i].offsetHeight || 0)
                            if (i == len - 1) {
                                /**
                                 * Since items typically updated after scrolling to end,
                                 * and new contents are appended at the end, we only need to check downwards
                                 */
                                this.checkVisibility(!shrinked && DIRECTION_DOWN);
                            }
                        }
                        /* Cache scrollHeight */
                        fastdom.measure(() => this.$el && (this.scrollHeight = this.$el.scrollHeight));
                    });
                }
            }
        }
    };
}