import University from './University'

function UniversitiesList({universities}){

    const uniComponents = universities.map(university => {
        return <University key={university.id} university={university} />
    })

    return (
        <ul className="uni-list">{uniComponents}</ul>
        )
}

export default UniversitiesList