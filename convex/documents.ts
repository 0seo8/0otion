import { v } from 'convex/values';

import { Doc, Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';

export const archive = mutation({
  args: {
    id: v.id('documents'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const userId = identity.subject;
    const exixtingDocument = await ctx.db.get(args.id);
    if (!exixtingDocument) throw new Error('Document not found');
    if (exixtingDocument.userId !== userId) throw new Error('Not authorized');

    //Also archive all child documents
    const recursiveArchive = async (documentId: Id<'documents'>) => {
      const children = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', (q) => q.eq('userId', userId).eq('parentDocument', documentId))
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: true,
        });
        await recursiveArchive(child._id);
      }
    };

    const document = await ctx.db.patch(args.id, {
      isArchived: true,
    });
    await recursiveArchive(args.id);
    return document;
  },
});

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id('documents')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const userId = identity.subject;

    const documents = await ctx.db
      .query('documents')
      .withIndex('by_user_parent', (q) => q.eq('userId', userId).eq('parentDocument', args.parentDocument))
      .filter((q) => q.eq(q.field('isArchived'), false))
      .order('desc')
      .collect();

    return documents;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id('documents')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log('여기서 문젠가?', identity);
    if (!identity) throw new Error('Not authenticated');

    const userId = identity.subject;

    const document = await ctx.db.insert('documents', {
      title: args.title,
      userId,
      parentDocument: args.parentDocument,
      isArchived: false,
      isPublished: false,
    });
    return document;
  },
});

export const getTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const userId = identity.subject;

    const documents = await ctx.db
      .query('documents')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('isArchived'), true))
      .order('desc')
      .collect();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return documents;
  },
});

export const restore = mutation({
  args: {
    id: v.id('documents'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) throw new Error('Document not found');
    if (existingDocument.userId !== userId) throw new Error('Not authorized');

    //recursively restore all child documents
    const recursiveRestore = async (documentId: Id<'documents'>) => {
      const children = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', (q) => q.eq('userId', userId).eq('parentDocument', documentId))
        .collect();

      for (const child of children) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
        await ctx.db.patch(child._id, {
          isArchived: false,
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
        await recursiveRestore(child._id);
      }
    };

    //Partial -> All the properties are optional except "isArchived"
    const options: Partial<Doc<'documents'>> = {
      isArchived: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (existingDocument.parentDocument) {
      const parent = await ctx.db.get(existingDocument.parentDocument);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (parent?.isArchived) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        options.parentDocument = undefined;
      }
    }

    const document = await ctx.db.patch(args.id, options);
    //call recursive restore function to archive all children
    await recursiveRestore(args.id);
    return document;
  },
});

export const remove = mutation({
  args: {
    id: v.id('documents'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) throw new Error('Document not found');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (existingDocument.userId !== userId) throw new Error('Not authorized');

    //delete the document
    const document = await ctx.db.delete(args.id);

    return document;
  },
});

export const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const userId = identity.subject;

    const documents = await ctx.db
      .query('documents')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('isArchived'), false))
      .order('desc')
      .collect();
    return documents;
  },
});

export const getById = query({
  args: {
    documentId: v.id('documents'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity(); // I will not check further for must have identity, because further this api will be used for accessing public published notes...
    const document = await ctx.db.get(args.documentId);
    if (!document) throw new Error('Document not found');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
    if (document.isPublished && !document.isArchived) return document;

    //document is not published or is archived, so check if the user is the owner of the document
    if (!identity) throw new Error('Not authenticated');
    const userId = identity.subject;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (document.userId !== userId) throw new Error('Not authorized');
    return document;
  },
});

export const update = mutation({
  args: {
    id: v.id('documents'),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },

  handler: async (ctx, args) => {
    const indentiy = await ctx.auth.getUserIdentity();
    if (!indentiy) throw new Error('Not authenticated');
    const userId = indentiy.subject;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = args;

    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) throw new Error('Document not found');
    if (existingDocument.userId !== userId) throw new Error('Not authorized');
    const document = await ctx.db.patch(args.id, { ...rest });
    return document;
  },
});

export const deleteIcon = mutation({
  args: {
    id: v.id('documents'),
  },
  handler: async (ctx, args) => {
    const indentiy = await ctx.auth.getUserIdentity();
    if (!indentiy) throw new Error('Not authenticated');
    const userId = indentiy.subject;
    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) throw new Error('Document not found');
    if (existingDocument.userId !== userId) throw new Error('Not authorized');
    const document = await ctx.db.patch(args.id, { icon: undefined });
    return document;
  },
});

export const removeCover = mutation({
  args: {
    id: v.id('documents'),
  },
  handler: async (ctx, args) => {
    const indentiy = await ctx.auth.getUserIdentity();
    if (!indentiy) throw new Error('Not authenticated');
    const userId = indentiy.subject;
    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) throw new Error('Document not found');
    if (existingDocument.userId !== userId) throw new Error('Not authorized');
    const document = await ctx.db.patch(args.id, { coverImage: undefined });
    return document;
  },
});
