<template>
  <v-container
    fluid
  >
    <h1>Add or Delete Tags</h1>
    <v-layout
      align-center
      justify-center
    >
      <v-flex
        xs12
        md4
      >
        <v-text-field 
          v-model="newTag"
          label="Enter New Tags Here"
        />
        <v-btn
          @click="addTag"
        >
          Add To List
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout
      justify-start
      row
      wrap
    >
      <v-flex
        xs12
        md4
      >
        <div>
          <h1>
            Established Tags
          </h1>
          <v-chip
            v-for="(tag, index) in chipTags"
            :key="index"
            close
            @input="remove(tag)"
          >
            {{ tag.name }}
          </v-chip>
        </div>
      </v-flex>
      <v-flex
        v-if="addedTags.length"
        xs12
        md4
      >
        <div>
          <h1>New Tags </h1>
          <v-chip
            v-for="(tag, index) in addedTags"
            :key="index"
            close
            @input="removeNewTag(tag)"
          >
            {{ tag }}
          </v-chip>
        </div>
      </v-flex>
      <v-flex
        v-if="removedTags.length"
        md4
        xs12 
      >
        <div>
          <h1>Deleted Tags </h1>
          <v-chip
            v-for="(tag, index) in removedTags"
            :key="index"
            @click="reAddTag(tag)"
          >
            {{ tag.name }}
            <v-icon right>
              add_circle
            </v-icon>
          </v-chip>
        </div>
      </v-flex>
    </v-layout>
    <v-layout
      justify-center
      row
      wrap
    >
      <v-flex
        xs12
        md4
      >
        <v-btn
          to="/admin"
        >
          Cancel
        </v-btn>
        <v-btn
          @click="submit"
        >
          Submit
        </v-btn>
      </v-flex>
    </v-layout>
    <h1>Edit Tag Names</h1>
    <v-layout
      row
      wrap
    >
      <v-flex
        v-for="(tag, i) in tags"
        :key="i"
        md4
        xs12
        style="padding: 15px"
      >
        <v-text-field
          :value="tags[i].name"
          @input="updateTagName($event, tag._id)"
        />
      </v-flex>
      <v-snackbar
        v-model="snackbar"
        :timeout="6000"
        :top="true"
      >
        {{ text }}
        <v-btn
          color="pink"
          flat
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </v-snackbar>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
	name: 'AdminEditMain',
	data () {
		return {
			newTag: '',
			removedTags: [],
			addedTags: [],
			snackbar: false,
			text: ''
		}
	},
	computed: {
		...mapState([
			'tags'
		]),
		chipTags: {
			get() {
				return this.tags.map(tag => ({...tag, chip:true}))
			},
			set(value) {
				this.SET_TAGS({
					type: 'tags',
					value: value
				})
			}
		},
	},
	async mounted() {
		if(!this.tags){
			await this.getTags()
		}
	},
	methods: {
		...mapMutations([
			'ADD_TAGS',
			'SET_TAGS',
			'REMOVE_TAG',
			'EDIT_TAG_NAME'
		]),
		...mapActions([
			'getTags',
			'postTags',
			'deleteTags'
		]),
		updateTagName(name, id) {
			this.EDIT_TAG_NAME({
				id: id,
				name: name
			})
		},
		addTag() {
			if(this.newTag !== '') {
				let tag = this.newTag.split(' ').join('-')
				this.addedTags.push(tag)
				this.newTag = ''
			}
		},
		remove(val) {
			this.removedTags.push(val)
			let index = this.tags.indexOf(this.tags.find(tag => tag.name === val.name))
			this.REMOVE_TAG(index)
		},
		removeNewTag(tag) {
			this.addedTags.splice(this.addedTags.indexOf(tag), 1)
		},
		reAddTag(tag) {
			this.ADD_TAGS([tag])
			this.removedTags.splice(this.removedTags.indexOf(tag), 1)
		},
		submit() {
			if(this.addedTags.length){
				this.postTags(this.addedTags.map(name => ({name: name})))
			}
			if(this.removedTags.length) {
				console.log(this.removedTags)
				this.deleteTags(this.removedTags).then(tag => {
					this.removedTags = []
					console.log(tag)
					this.text= "Delete: " + tag.toString() + " tags"
					this.snackbar = true
				}
				)
			}
		}
	}
}
</script>

<style scoped>

</style>
