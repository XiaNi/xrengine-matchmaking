import {
  isOpenAPIError,
  OpenMatchTicket,
  OpenMatchTicketAssignment,
  OpenMatchTicketAssignmentResponse
} from './interfaces'
import axios from "axios";
import { IncomingMessage } from 'http';

const FRONTEND_SERVICE_URL = 'http://localhost:51504/v1/frontendservice'
const axiosInstance = axios.create({
  baseURL: FRONTEND_SERVICE_URL
});

function checkForApiErrorResponse(response: unknown): unknown {
  if (isOpenAPIError(response)) {
    throw response
  }
  return response
}

function createTicket(gameMode): Promise<OpenMatchTicket> {
  return axiosInstance.post(`/tickets`, {
    ticket: {
      searchFields: {
        tags: [gameMode],
        DoubleArgs: {
          'time.enterqueue': 0
        }
      }
    }
  })
    .then(r => r.data)
    .then(checkForApiErrorResponse)
    .then((response) => response as OpenMatchTicket)
}

// TicketAssignmentsResponse
function getTicketsAssignment(ticketId: string): Promise<OpenMatchTicketAssignment> {
  return axiosInstance.get(`/tickets/${ticketId}/assignments`, {responseType:"stream"})
      .then(response => {
        if (!(response.data instanceof IncomingMessage)) {
          throw new Error('Unexpected data:' + String(response.data))
        }
        const incoming = response.data as IncomingMessage
        return new Promise((resolve, reject) => {
          incoming.on('data', (chunk) => {
            // i don't know why but this stream never ends, so i resolve and destroy on first data received
            resolve(JSON.parse(chunk.toString()))
            incoming.destroy()
          });
          incoming.on('error', e => {
            reject(e)
          })
          // i don't know why but this stream never ends
          // incoming.on('end', () => {
          //   resolve(body)
          // });
        })
      })
      .then(checkForApiErrorResponse)
      .then((response) => (response as OpenMatchTicketAssignmentResponse).result.assignment)
}

function getTicket(ticketId: string): Promise<OpenMatchTicket> {
  return axiosInstance.get(`/tickets/${ticketId}`)
      .then(r => r.data)
      .then(checkForApiErrorResponse)
      .then(result => {
        return result as OpenMatchTicket
      })
}

function deleteTicket(ticketId: string): Promise<void> {
  return axiosInstance.delete(`/tickets/${ticketId}`)
      .then(checkForApiErrorResponse)
      .then(result => {})
}

export { createTicket, getTicket, deleteTicket, getTicketsAssignment }
