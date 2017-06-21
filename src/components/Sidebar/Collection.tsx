import * as React from 'react'
import { MouseEventHandler, ReactChildren, ReactElement } from 'react'
import { observer } from 'mobx-react'

import { i18n } from '../../stores/I18nStore'
import { ChapterType } from '../../stores/constants'
import appState, { IChapter, IChapterGroup, IBook, INotesOfTags, AppState } from '../../stores/AppState'

function CollectionHead(props: {
  iconClass: string, name: string, onClick: MouseEventHandler<HTMLDivElement>,
  notesNum?: number, children?: ReactChildren
}) {
  const {iconClass, name, onClick, notesNum = -1, children} = props
  return (
    <div className="collection-head" onClick={onClick}>
      <div className="collection-icon">
        <span className={iconClass} />
      </div>
      <div className="collection-title">{name}</div>
      {notesNum > -1 ? <div className="collection-number">{notesNum}</div> : null}
      {children}
    </div>
  )
}

function AddNotebooks() {
  return (
    <div className="add-notebooks-btn" role="button"> + </div>
  )
}

function BookHead(props: { color: string, name: string }) {
  const {color, name} = props
  return (
    <div className="book-head">
      <span className="book-arrow" />
      <div className="book-icon">
        <span className='' style={{color: color}} />
      </div>
      <div className="book-title">{name}</div>
    </div>
  )
}

const Chapter = observer((props: { chapter: IChapter }) => {
  const {chapter} = props
  return (
    <div className="chapter" onClick={() => appState.showNotes(chapter.notes)}>
      <span className="chapter-icon" style={{color: chapter.color}} />
      <div className="chapter-title">{chapter.name}</div>
    </div>
  )
})

const ChapterGroup = observer((props: { group: IChapterGroup }) => {
  const {group} = props
  return (
    <div className="chapter-group">
      <div>
        <span className="chapter-arrow" />
        <span className="chapter-group-icon" style={{color: group.color}} />
        <div className="chapter-group-title">{group.name}</div>
      </div>
      <Chapters chapters={group.chapters} />
    </div>
  )
})

// TS will report errors if not to do this
interface IChaptersProps {
  chapters: Array<IChapter | IChapterGroup>
}
const Chapters = observer((props: IChaptersProps): ReactElement<IChaptersProps> => {
  const {chapters} = props
  return (
    <div className="chapters">
      {
        chapters.map((chapter, i) => {
          switch (chapter.type) {
            case ChapterType.CHAPTER:
              return <Chapter chapter={chapter as IChapter} key={i} />
            case ChapterType.GROUP:
              return <ChapterGroup group={chapter as IChapterGroup} key={i} />
            default:
              return null
          }
        })
      }
    </div>
  )
})

const Book = observer((props: { book: IBook }) => {
  const {book} = props
  return (
    <div className="book">
      <BookHead color={book.color} name={book.name} />
      <Chapters chapters={book.chapters} />
    </div>
  )
})

const Books = observer((props: { books: IBook[] }) => {
  const {books} = props
  return (
    <div className="books">
      {
        books.map((book, i) => <Book book={book} key={i} />)
      }
    </div>
  )
})

const Collection = observer((props: {
  iconClass: string, name: string, notes: number[], onClick: MouseEventHandler<HTMLDivElement>
}) => {
  const {iconClass, name, notes, onClick} = props
  return (
    <CollectionHead
      iconClass={iconClass} name={name} notesNum={notes.length} onClick={onClick}
    />
  )
})

const CollectionWithBooks = observer((props: {
  iconClass: string, name: string, books: IBook[]
}) => {
  const {iconClass, name, books} = props
  const clickHandler = () => {}
  return (
    <div className="collection-with-books">
      <CollectionHead iconClass={iconClass} name={name} onClick={clickHandler}>
        <AddNotebooks />
      </CollectionHead>
      <Books books={books} />
    </div>
  )
})

export const Notebooks = observer((props: { appState: AppState }) => {
  const {appState} = props
  return (
    <div id="notebooks">
      <Collection
        iconClass="" name={i18n('recents')} notes={appState.recents}
        onClick={() => appState.showNotes(appState.recents)}
      />
      <Collection
        iconClass="" name={i18n('trash')} notes={appState.notesInTrash}
        onClick={() => appState.showNotes(appState.notesInTrash)}
      />
      <CollectionWithBooks iconClass="" name={i18n('notebooks')} books={appState.notebooks} />
    </div>
  )
})

const Tag = observer((props: { tag: string, notes: number[] }) => {
  const {tag, notes} = props
  return (
    <div className="tag" onClick={() => appState.showNotes(notes)}>{tag}</div>
  )
})

export const Tags = observer((props: { notesOfTags: INotesOfTags }) => {
  const {notesOfTags} = props
  return (
    <div id="tags">
      {
        Object.keys(notesOfTags).map(tag => {
          return <Tag tag={tag} notes={notesOfTags[tag]} key={tag} />
        })
      }
    </div>
  )
})