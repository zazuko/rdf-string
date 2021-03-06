import { BlankNode, DatasetCore, DefaultGraph, Literal, NamedNode, Quad, Term } from 'rdf-js'
import RDF from '@rdf-esm/data-model'
import { NQuadsStrategy } from './nquads'
import { Value } from './value'
import { PartialString, TemplateResult } from './TemplateResult'

interface NTriplesOptions {
  graph: NamedNode | DefaultGraph
  sortGraphs: false
}

export type NTriplesValue<T extends Term = Term> = Value<NTriplesTemplateResult, T>

export type NTriplesTemplateResult = TemplateResult<NTriplesOptions>

export class NTriplesStrategy extends NQuadsStrategy<NTriplesOptions> {
  public evaluateDataset(dataset: DatasetCore, options: NTriplesOptions): PartialString {
    const singleGraph = dataset.match(null, null, null, options.graph)
    return super.evaluateDataset(singleGraph, options)
  }

  public evaluateQuad(quad: Quad, options: NTriplesOptions): PartialString {
    if (!options.graph.equals(quad.graph)) {
      return {
        value: '',
        prefixes: [],
      }
    }

    return super.evaluateQuad(RDF.triple(quad.subject, quad.predicate, quad.object), options)
  }
}

export const ntriples = (strings: TemplateStringsArray, ...values: Value<NTriplesTemplateResult, NamedNode | Literal | BlankNode>[]) =>
  new TemplateResult<NTriplesOptions>({
    strings,
    values,
    tag: ntriples,
    strategy: new NTriplesStrategy(),
    defaultOptions: {
      graph: RDF.defaultGraph(),
      sortGraphs: false,
    },
  })
